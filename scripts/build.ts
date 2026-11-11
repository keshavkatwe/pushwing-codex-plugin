import { mkdir, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { packageFiles, projectRoot, validatePackage } from './package.ts';

export async function buildPlugin(sourceRoot = projectRoot, output = join(sourceRoot, 'dist')) {
  const source = resolve(sourceRoot);
  const outDir = resolve(output);
  if (source === outDir || source.startsWith(`${outDir}/`)) {
    throw new Error('Output cannot replace the source directory or its parents');
  }
  const result = await validatePackage(source);
  await mkdir(outDir, { recursive: true });
  const archive = join(outDir, 'pushwing-openai.zip');
  // Recreate the archive so files deleted from the plugin cannot survive a rebuild.
  await rm(archive, { force: true });
  const zipped = Bun.spawnSync(['zip', '-q', archive, ...packageFiles], {
    cwd: result.plugin,
    stdout: 'pipe',
    stderr: 'pipe',
  });
  if (zipped.exitCode !== 0) throw new Error(`ZIP failed: ${zipped.stderr.toString()}`);
  return { ...result, outDir, archive };
}

if (import.meta.main) {
  const result = await buildPlugin();
  console.log(`Built Pushwing ${result.version}: ${result.archive}`);
}
