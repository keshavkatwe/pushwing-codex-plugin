import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { projectRoot, skillNames } from './package.ts';

// Exercise the installed client's package reader without installing a plugin,
// starting an agent/model, authenticating, or calling provider tools.
const proc = Bun.spawn(['codex', 'app-server', '--stdio'], {
  cwd: projectRoot,
  stdin: 'pipe',
  stdout: 'pipe',
  stderr: 'pipe',
});
type Reply = { id?: number; result?: unknown; error?: { message: string } };
const pending = new Map<
  number,
  { resolve: (value: unknown) => void; reject: (error: Error) => void }
>();
const stderr = new Response(proc.stderr).text();
void proc.exited.then(() => {
  for (const item of pending.values()) {
    item.reject(
      new Error('Codex exited before completing the package read; see startup diagnostics'),
    );
  }
});
const decoder = new TextDecoder();
const reading = (async () => {
  let buffer = '';
  for await (const chunk of proc.stdout) {
    buffer += decoder.decode(chunk, { stream: true });
    let newline = buffer.indexOf('\n');
    while (newline >= 0) {
      const line = buffer.slice(0, newline);
      buffer = buffer.slice(newline + 1);
      if (line.trim()) {
        const reply = JSON.parse(line) as Reply;
        if (reply.id !== undefined) {
          const request = pending.get(reply.id);
          if (request) {
            pending.delete(reply.id);
            if (reply.error) request.reject(new Error(reply.error.message));
            else request.resolve(reply.result);
          }
        }
      }
      newline = buffer.indexOf('\n');
    }
  }
})().catch((error: Error) => {
  for (const request of pending.values()) request.reject(error);
});

let id = 0;
function request(method: string, params: unknown) {
  const requestId = ++id;
  return new Promise<unknown>((resolve, reject) => {
    pending.set(requestId, { resolve, reject });
    proc.stdin.write(`${JSON.stringify({ id: requestId, method, params })}\n`);
    proc.stdin.flush();
  });
}
const timeout = setTimeout(() => {
  for (const item of pending.values())
    item.reject(new Error('Codex package read timed out after 30s'));
  proc.kill();
}, 30_000);

let succeeded = false;
try {
  await request('initialize', {
    clientInfo: { name: 'pushwing_local_package_check', version: '0.1.0' },
    capabilities: { experimentalApi: true },
  });
  proc.stdin.write(`${JSON.stringify({ method: 'initialized' })}\n`);
  proc.stdin.flush();
  const response = (await request('plugin/read', {
    marketplacePath: join(projectRoot, '.agents/plugins/marketplace.json'),
    pluginName: 'pushwing',
  })) as {
    plugin: {
      summary: {
        name: string;
        installed: boolean;
        interface?: { displayName?: string; longDescription?: string; defaultPrompt?: string[] };
      };
      marketplaceName: string;
      skills: { name: string }[];
      mcpServers: string[];
      apps: { id: string; name: string }[];
      appTemplates: { id?: string; canonicalConnectorId?: string; name?: string }[];
    };
  };
  assert.equal(response.plugin.summary.name, 'pushwing');
  assert.equal(response.plugin.marketplaceName, 'pushwing-plugins');
  assert.deepEqual(
    response.plugin.skills.map((skill) => skill.name).sort(),
    skillNames.map((name) => `pushwing:${name}`).sort(),
  );
  assert.deepEqual(response.plugin.mcpServers, ['pushwing']);
  assert.deepEqual(response.plugin.apps, []);
  assert.equal(response.plugin.summary.interface?.displayName, 'Pushwing');
  const authored = JSON.parse(
    await readFile(join(projectRoot, 'plugins/pushwing/plugin.json'), 'utf8'),
  ).extensions['com.openai'].interface;
  assert.deepEqual(response.plugin.summary.interface?.defaultPrompt, authored.defaultPrompt);
  assert.equal(response.plugin.summary.interface?.longDescription, authored.longDescription);
  succeeded = true;
  console.log(
    'Codex native reader: hosted Pushwing MCP server, five skills, three starter prompts and full description verified; no private app reference.',
  );
  console.log(
    `Installed: ${response.plugin.summary.installed}; no install was requested by this check.`,
  );
} finally {
  clearTimeout(timeout);
  proc.stdin.end();
  proc.kill();
  await proc.exited;
  await reading;
  const diagnostics = await stderr;
  if (!succeeded && diagnostics) console.error(diagnostics.slice(-1500));
}
