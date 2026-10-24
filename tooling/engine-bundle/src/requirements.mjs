/* @layer tooling-scripts @kind logic */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { exists } from './download.mjs';
import { requirementName } from './requirement-name.mjs';

const engineRequirements = async (apRoot, { skip, extra }, outFile) => {
  const root = await readFile(join(apRoot, 'requirements.txt'), 'utf8');
  const kept = root.split(/\r?\n/).filter((line) => !skip.includes(requirementName(line)));
  await writeFile(outFile, [...kept, ...extra].join('\n'), 'utf8');
  const worlds = await readdir(join(apRoot, 'worlds'), { withFileTypes: true });
  const perWorld = worlds.filter((d) => d.isDirectory()).map((d) => join(apRoot, 'worlds', d.name, 'requirements.txt'));
  const present = await Promise.all(perWorld.map(async (f) => ((await exists(f)) ? f : undefined)));
  return [outFile, ...present.filter((f) => f !== undefined)];
};

export { engineRequirements };
