import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { cp, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildPlugin } from '../scripts/build.ts';
import {
  endpoint,
  packageFiles,
  parseSkill,
  pluginPath,
  projectRoot,
  readJson,
  skillNames,
  validatePackage,
} from '../scripts/package.ts';
import catalog from './fixtures/tool-catalog.json';

let scratch: string;
let source: string;
let plugin: string;
let output: string;
let archive: string;

beforeAll(async () => {
  scratch = await mkdtemp(join(tmpdir(), 'pushwing-package-'));
  source = join(scratch, 'source');
  plugin = join(source, pluginPath);
  output = join(scratch, 'dist');
  await cp(projectRoot, source, {
    recursive: true,
    filter: (path) =>
      !['node_modules', 'dist', '.git'].some((part) => path.split('/').includes(part)),
  });
  await writeFile(join(source, '.env'), 'PLUGIN_TEST_SENTINEL=not-a-real-credential\n');
  archive = (await buildPlugin(source, output)).archive;
});

afterAll(async () => {
  await rm(scratch, { recursive: true, force: true });
});

describe('standalone installable plugin', () => {
  test('validates the ready-to-install marketplace and hosted OAuth package', async () => {
    const result = await validatePackage(source);
    expect(result.skills).toBe(5);
    const manifest = await readJson(plugin, 'plugin.json');
    const host = manifest.extensions['com.openai'];
    const listing = host.interface;
    expect(manifest.version).toBe((await readJson(source, 'package.json')).version);
    expect(manifest.apps).toBeUndefined();
    expect(host.apps).toBeUndefined();
    expect(listing.defaultPrompt).toHaveLength(3);
    const prompts = listing.defaultPrompt.map((prompt: string) => {
      expect(prompt.length).toBeLessThanOrEqual(128);
      expect(prompt).not.toContain('@');
      return prompt.normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
    });
    expect(new Set(prompts).size).toBe(3);
    expect(listing.longDescription.length).toBeLessThanOrEqual(4000);
    for (const capability of listing.capabilities)
      expect(capability.length).toBeLessThanOrEqual(120);
    expect(await Bun.file(join(plugin, host.onboardingSkill)).exists()).toBe(true);
    for (const field of ['logo', 'composerIcon']) {
      expect(await Bun.file(join(plugin, listing[field])).exists()).toBe(true);
    }
    const mcp = await readJson(plugin, 'mcp.json');
    expect(mcp.mcpServers).toEqual({ pushwing: { type: 'streamable-http', url: endpoint } });
    const marketplace = await readJson(source, '.agents/plugins/marketplace.json');
    expect(marketplace.name).toBe('pushwing-plugins');
    expect(join(source, marketplace.plugins[0].source.path)).toBe(plugin);
  });

  test('keeps all five skills independently usable with confirmation and account rules', async () => {
    for (const name of skillNames) {
      const skill = parseSkill(await readFile(join(plugin, `skills/${name}/SKILL.md`), 'utf8'));
      expect(skill.name).toBe(name);
      expect(skill.body).toContain('## Shared Pushwing workflow');
      expect(skill.body).toContain('`pushwing_list_connections`');
      expect(skill.body).toContain('confirm=false');
      expect(skill.body).toContain('Wait for the user to approve');
      expect(skill.body).toContain('outcome is unknown');
    }
  });

  test('archives only one plugin and excludes marketplaces, review notes and credentials', async () => {
    const listed = Bun.spawnSync(['unzip', '-Z1', archive]);
    expect(listed.exitCode).toBe(0);
    const entries = listed.stdout.toString().trim().split('\n').sort();
    expect(entries).toEqual(packageFiles);
    expect(entries.filter((path) => path.endsWith('/SKILL.md'))).toHaveLength(5);
    const unpacked = Bun.spawnSync(['unzip', '-p', archive]).stdout.toString();
    expect(unpacked).not.toContain('PLUGIN_TEST_SENTINEL');
    expect(unpacked).not.toContain('asdk_app_');
    for (const path of entries) {
      expect(path).not.toMatch(
        /(^\/|\.\.|\.env|node_modules|scripts\/|marketplace|review\/|tests\/)/,
      );
    }
    const manifest = Bun.spawnSync(['unzip', '-p', archive, 'plugin.json']);
    expect(JSON.parse(manifest.stdout.toString()).version).toBe(
      (await readJson(source, 'package.json')).version,
    );
  });

  test('references tools from the dated catalog snapshot without importing the backend', async () => {
    const tools = new Set(catalog.tools);
    expect(tools.size).toBe(catalog.tools.length);
    for (const name of skillNames) {
      const body = await readFile(join(plugin, `skills/${name}/SKILL.md`), 'utf8');
      for (const match of body.matchAll(/`(pushwing_[a-z0-9_]+)`/g)) {
        expect(tools.has(match[1] ?? '')).toBe(true);
      }
    }
  });

  test('rebuilding removes deleted app bindings and stale ZIP files', async () => {
    await writeFile(join(scratch, '.app.json'), '{"apps":{"pushwing":{"id":"asdk_app_deleted"}}}');
    const old = Bun.spawnSync(['zip', '-q', archive, '.app.json'], { cwd: scratch });
    expect(old.exitCode).toBe(0);
    await buildPlugin(source, output);
    const entries = Bun.spawnSync(['unzip', '-Z1', archive])
      .stdout.toString()
      .trim()
      .split('\n')
      .sort();
    expect(entries).toEqual(packageFiles);
  });

  test('rejects unexpected files and symlinks before replacing a usable ZIP', async () => {
    const before = await readFile(archive);
    const leak = join(plugin, 'leak.env');
    await symlink(join(source, '.env'), leak);
    try {
      await expect(buildPlugin(source, output)).rejects.toThrow('Symlinks cannot enter');
    } finally {
      await rm(leak);
    }
    await writeFile(leak, 'PLUGIN_TEST_SENTINEL');
    try {
      await expect(buildPlugin(source, output)).rejects.toThrow(
        'Unexpected or missing plugin files',
      );
    } finally {
      await rm(leak);
    }
    expect(await readFile(archive)).toEqual(before);
  });

  test('rejects invalid skill metadata, version drift and destructive output paths', async () => {
    expect(() => parseSkill('# no metadata')).toThrow();
    expect(() => parseSkill('---\nname: publish\n---\nBody')).toThrow();
    await expect(buildPlugin(source, source)).rejects.toThrow('Output cannot replace');
    const path = join(plugin, 'plugin.json');
    const original = await readFile(path, 'utf8');
    const changed = JSON.parse(original);
    changed.version = '99.0.0';
    await writeFile(path, JSON.stringify(changed));
    try {
      await expect(buildPlugin(source, output)).rejects.toThrow('package.json version');
    } finally {
      await writeFile(path, original);
    }
  });
});
