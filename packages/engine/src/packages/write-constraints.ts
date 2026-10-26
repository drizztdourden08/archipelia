/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { InstallPackagesOptions } from './install-packages.type';
import { runPip } from './run-pip';

const writeConstraints = async (runtime: EngineRuntime, dir: string, options: InstallPackagesOptions): Promise<string> => {
  const frozen = await runPip(runtime, ['list', '--format=freeze', '--isolated', '--disable-pip-version-check'], dir, options);
  const file = join(dir, 'constraints.txt');
  await writeFile(file, frozen.filter((line) => line.includes('==')).join('\n'), 'utf8');
  return file;
};

export { writeConstraints };
