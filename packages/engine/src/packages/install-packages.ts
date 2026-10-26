/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { InstallPackagesOptions } from './install-packages.type';
import { PIN, PIP_FLAGS } from './install-packages.constants';
import { runPip } from './run-pip';
import { withPipDir } from './with-pip-dir';
import { writeConstraints } from './write-constraints';

const installPackages = async (runtime: EngineRuntime, pins: string[], options: InstallPackagesOptions = {}): Promise<void> => {
  if (pins.length === 0) return;
  const loose = pins.find((pin) => !PIN.test(pin));
  if (loose !== undefined) throw new Error(`${loose} is not an exact name==version pin`);
  await withPipDir(async (dir) => {
    const constraints = await writeConstraints(runtime, dir, options);
    const requirements = join(dir, 'requirements.txt');
    await writeFile(requirements, pins.join('\n'), 'utf8');
    await runPip(runtime, ['install', ...PIP_FLAGS, '--no-deps', '-c', constraints, '-r', requirements], dir, options);
  });
};

export { installPackages };
