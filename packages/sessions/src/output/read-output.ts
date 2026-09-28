/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import { unzipSync } from 'fflate';
import type { SessionOutput } from '@archipelia/model';
import { SEED, SPOILER } from './read-output.constants';

const baseName = (path: string) => path.split(/[\\/]/).pop() ?? path;

const readOutput = async (files: FileStore, outputDir: string, zipPath: string, generateLog: string) => {
  const zipName = baseName(zipPath);
  const bytes = await files.readBytes(`${outputDir}/${zipName}`);
  if (!bytes) throw new Error(`generator output ${zipName} is missing`);
  const entries = unzipSync(bytes);
  const names = Object.keys(entries);
  const spoilerName = names.find((name) => SPOILER.test(name));
  if (spoilerName) await files.writeText(`${outputDir}/${baseName(spoilerName)}`, new TextDecoder().decode(entries[spoilerName]));
  const output: SessionOutput = { zip: zipName, files: names, spoiler: spoilerName && baseName(spoilerName), generateLog };
  return { output, seed: zipName.match(SEED)?.[1] };
};

export { readOutput };
