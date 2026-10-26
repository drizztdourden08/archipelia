/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { InstallPackagesOptions } from './install-packages.type';
import { normalizePackageName } from './normalize-package-name';
import { runPip } from './run-pip';

const writeConstraints = async (runtime: EngineRuntime, dir: string, options: InstallPackagesOptions, without?: string): Promise<string> => {
  const frozen = await runPip(runtime, ['list', '--format=freeze', '--isolated', '--disable-pip-version-check'], dir, options);
  const file = join(dir, 'constraints.txt');
  const kept = frozen.filter((line) => line.includes('==') && normalizePackageName(line.split('==')[0] ?? '') !== without);
  await writeFile(file, kept.join('\n'), 'utf8');
  return file;
};

export { writeConstraints };
