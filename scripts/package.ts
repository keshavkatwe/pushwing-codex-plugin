import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

export const projectRoot = resolve(import.meta.dir, '..');
export const skillNames = ['setup', 'publish', 'schedule', 'status', 'report'] as const;
export const endpoint = 'https://mcp.pushwing.com/mcp';
export const marketplaceName = 'pushwing-plugins';
export const pluginPath = 'plugins/pushwing';
export const packageFiles = [
  'plugin.json',
  'mcp.json',
  'README.md',
  'assets/icon.svg',
  ...skillNames.flatMap((name) => [`skills/${name}/SKILL.md`, `skills/${name}/agents/openai.yaml`]),
].sort();

export function parseSkill(text: string) {
  const match = /^---\n([\s\S]+?)\n---\n([\s\S]+)$/.exec(text);
  const frontmatter = match?.[1];
  const body = match?.[2]?.trim();
  assert.ok(frontmatter && body, 'Skill needs YAML frontmatter and a body');
  const metadata = Bun.YAML.parse(frontmatter) as { name?: unknown; description?: unknown };
  assert.ok(
    typeof metadata.name === 'string' && /^[a-z][a-z0-9-]*$/.test(metadata.name),
    'Skill needs a kebab-case name',
  );
  assert.ok(
    typeof metadata.description === 'string' && metadata.description.trim(),
    'Skill needs a nonempty description',
  );
  return { name: metadata.name, description: metadata.description, body };
}

async function listFiles(root: string, prefix = ''): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(join(root, prefix), { withFileTypes: true })) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    assert.ok(!entry.isSymbolicLink(), `Symlinks cannot enter the plugin: ${path}`);
    if (entry.isDirectory()) files.push(...(await listFiles(root, path)));
    else {
      assert.ok(entry.isFile(), `Unsupported plugin entry: ${path}`);
      files.push(path);
    }
  }
  return files.sort();
}

export async function readJson(root: string, path: string) {
  return JSON.parse(await readFile(join(root, path), 'utf8'));
}

export async function validatePackage(source = projectRoot) {
  const plugin = join(source, pluginPath);
  const pkg = await readJson(source, 'package.json');
  const manifest = await readJson(plugin, 'plugin.json');
  assert.equal(manifest.name, 'pushwing');
  assert.equal(manifest.version, pkg.version, 'Manifest must match the package.json version');
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
  assert.equal(manifest.$schema, 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json');
  assert.equal(manifest.apps, undefined);
  const host = manifest.extensions['com.openai'];
  assert.equal(host.apps, undefined);
  assert.equal(host.interface.displayName, 'Pushwing');
  assert.ok(host.interface.shortDescription.trim());
  assert.ok(host.interface.shortDescription.length <= 30);
  assert.equal(host.onboardingSkill, './skills/setup/SKILL.md');
  const mcp = await readJson(plugin, 'mcp.json');
  assert.equal(mcp.$schema, 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json');
  assert.deepEqual(mcp.mcpServers, { pushwing: { type: 'streamable-http', url: endpoint } });
  const catalog = await readJson(source, '.agents/plugins/marketplace.json');
  assert.equal(catalog.name, marketplaceName);
  assert.deepEqual(catalog.plugins, [
    {
      name: 'pushwing',
      source: { source: 'local', path: `./${pluginPath}` },
      policy: { installation: 'AVAILABLE', authentication: 'ON_INSTALL' },
      category: 'Productivity',
    },
  ]);
  assert.deepEqual(await listFiles(plugin), packageFiles, 'Unexpected or missing plugin files');
  for (const name of skillNames) {
    const skill = parseSkill(await readFile(join(plugin, `skills/${name}/SKILL.md`), 'utf8'));
    assert.equal(skill.name, name);
    const metadata = Bun.YAML.parse(
      await readFile(join(plugin, `skills/${name}/agents/openai.yaml`), 'utf8'),
    ) as {
      interface?: { display_name?: string; short_description?: string };
      dependencies?: unknown;
    };
    assert.ok(metadata.interface?.display_name?.trim());
    assert.ok(metadata.interface?.short_description?.trim());
    assert.equal(metadata.dependencies, undefined);
  }
  return { version: manifest.version as string, skills: skillNames.length, plugin };
}
