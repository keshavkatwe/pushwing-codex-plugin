import { copyFile, mkdir, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { packageFiles, projectRoot, readJson, validatePackage } from './package.ts';

/** Stage an incomplete directory-review draft; never upload or install it. */
export async function prepareSubmission(
  sourceRoot = projectRoot,
  output = join(sourceRoot, 'dist'),
) {
  const source = resolve(sourceRoot);
  const draft = resolve(output, 'submission-draft/pushwing');
  if (source === draft || source.startsWith(`${draft}/`)) {
    throw new Error('Draft output cannot replace the source directory or its parents');
  }
  const { plugin, version } = await validatePackage(source);
  const manifest = await readJson(plugin, 'plugin.json');
  const review = await readJson(source, 'review/review.json');
  const details = await readJson(source, 'review/details.json');
  const host = manifest.extensions['com.openai'];
  manifest.author.name = details.developerName;
  host.interface.developerName = details.developerName;
  host.interface.logo = './assets/icon.png';
  host.interface.composerIcon = './assets/icon.png';
  host.interface.longDescription +=
    '\n\nDuring early access, Instagram connections require a tester invitation. New users may need an invitation before connecting.';
  host.review = {
    ...review,
    commerce: details.commerce,
    commerce_description: details.commerce_description,
  };
  host.publication = {
    countries: details.countries,
    release_notes: `Initial public submission candidate based on plugin ${version}: five workflows for account setup, publishing, scheduling, job status and performance reporting. Connects to the hosted Pushwing MCP service using OAuth.`,
  };
  await rm(draft, { recursive: true, force: true });
  for (const path of packageFiles) {
    if (['plugin.json', 'README.md', 'assets/icon.svg'].includes(path)) continue;
    await mkdir(dirname(join(draft, path)), { recursive: true });
    await copyFile(join(plugin, path), join(draft, path));
  }
  await mkdir(join(draft, 'assets'), { recursive: true });
  await copyFile(join(source, 'review/icon.png'), join(draft, 'assets/icon.png'));
  await Bun.write(join(draft, 'plugin.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  return { draft, version };
}

if (import.meta.main) {
  const result = await prepareSubmission();
  console.log(`Staged public submission draft ${result.version}: ${result.draft}`);
  console.log(
    'NOT READY TO SUBMIT: reviewer access, fixtures, case runs and a demo remain unverified.',
  );
}
