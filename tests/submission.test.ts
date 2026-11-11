import { afterAll, beforeAll, expect, test } from 'bun:test';
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { endpoint, pluginPath, projectRoot, readJson, skillNames } from '../scripts/package.ts';
import { prepareSubmission } from '../scripts/prepare-submission.ts';
import catalog from './fixtures/tool-catalog.json';

let scratch: string;
let draft: string;
let original: string;

beforeAll(async () => {
  scratch = await mkdtemp(join(tmpdir(), 'pushwing-submission-'));
  original = await readFile(join(projectRoot, pluginPath, 'plugin.json'), 'utf8');
  draft = (await prepareSubmission(projectRoot, scratch)).draft;
});

afterAll(async () => {
  await rm(scratch, { recursive: true, force: true });
});

test('stages an incomplete review copy without changing the installable package', async () => {
  expect((await readdir(draft)).sort()).toEqual(['assets', 'mcp.json', 'plugin.json', 'skills']);
  const manifest = await readJson(draft, 'plugin.json');
  const host = manifest.extensions['com.openai'];
  expect(manifest.apps).toBeUndefined();
  expect(host.apps).toBeUndefined();
  expect(manifest.author.name).toBe('Keshav Katwe');
  expect(host.interface.developerName).toBe('Keshav Katwe');
  expect(host.review.demo_recording_url).toBeUndefined();
  expect(host.review.commerce).toBe(false);
  expect(host.publication.countries).toEqual([]);
  expect(host.publication.release_notes).toContain(manifest.version);
  expect((await readJson(draft, 'mcp.json')).mcpServers).toEqual({
    pushwing: { type: 'streamable-http', url: endpoint },
  });
  expect(host.interface.logo).toBe('./assets/icon.png');
  expect(host.interface.composerIcon).toBe('./assets/icon.png');
  expect(await readFile(join(draft, 'assets/icon.png'))).toEqual(
    await readFile(join(projectRoot, 'review/icon.png')),
  );
  expect(await readFile(join(projectRoot, pluginPath, 'plugin.json'), 'utf8')).toEqual(original);
  expect((await readdir(join(draft, 'skills'))).sort()).toEqual([...skillNames].sort());
  expect(await readdir(scratch)).toEqual(['submission-draft']);
  await expect(prepareSubmission(draft, scratch)).rejects.toThrow('Draft output cannot replace');
});

test('keeps five positive and three negative cases as unverified review plans', async () => {
  const review = (await readJson(draft, 'plugin.json')).extensions['com.openai'].review;
  expect(review.test_cases.positive).toHaveLength(5);
  expect(review.test_cases.negative).toHaveLength(3);
  const tools = new Set(catalog.tools);
  for (const item of review.test_cases.positive) {
    expect(item.expected_behavior.length).toBeGreaterThan(0);
    for (const match of item.tools_triggered.matchAll(/pushwing_[a-z0-9_]+/g)) {
      expect(tools.has(match[0])).toBe(true);
    }
  }
  for (const item of [...review.test_cases.positive, ...review.test_cases.negative]) {
    expect(item.description.length).toBeGreaterThan(0);
    expect(item.description.length).toBeLessThanOrEqual(4000);
    expect(item.prompt.length).toBeGreaterThan(0);
    expect(item).not.toHaveProperty('result');
    expect(item).not.toHaveProperty('status');
    expect(item).not.toHaveProperty('file_attachment_urls');
  }
});
