/* @layer core @kind logic */
import type { DataFiles, SessionOutput } from '@archipelia/model';
import { zipEntries, zipEntryBytes } from '@archipelia/model/zip';
import { SEED, SPOILER } from './read-output.constants';

const baseName = (path: string) => path.split(/[\\/]/).pop() ?? path;

const readOutput = async (files: DataFiles, outputDir: string, zipPath: string, generateLog: string) => {
  const zipName = baseName(zipPath);
  const bytes = await files.readBytes(`${outputDir}/${zipName}`);
  if (!bytes) throw new Error(`generator output ${zipName} is missing`);
  const entries = zipEntries(bytes);
  const names = entries.map((entry) => entry.name);
  const spoiler = entries.find((entry) => SPOILER.test(entry.name));
  if (spoiler) await files.writeText(`${outputDir}/${baseName(spoiler.name)}`, new TextDecoder().decode(zipEntryBytes(bytes, spoiler)));
  const output: SessionOutput = { zip: zipName, files: names, spoiler: spoiler && baseName(spoiler.name), generateLog };
  return { output, seed: zipName.match(SEED)?.[1] };
};

export { readOutput };
