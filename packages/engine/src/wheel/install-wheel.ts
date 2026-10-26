/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { copyFile, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { InstallPackagesOptions } from '../packages/install-packages.type';
import { PIP_FLAGS } from '../packages/install-packages.constants';
import { normalizePackageName } from '../packages/normalize-package-name';
import { runPip } from '../packages/run-pip';
import { withPipDir } from '../packages/with-pip-dir';
import { writeConstraints } from '../packages/write-constraints';
import type { WheelInstall } from './wheel.type';
import { REPLACES_INDEX, SHA256 } from './install-wheel.constants';
import { parseWheelName } from './parse-wheel-name';
import { wheelOrigin } from './wheel-origin';

const installWheel = async (runtime: EngineRuntime, { file, sha256 }: WheelInstall, options: InstallPackagesOptions = {}): Promise<void> => {
  const name = parseWheelName(basename(file));
  if (!name) throw new Error(`${basename(file)} is not a wheel file name`);
  if (!SHA256.test(sha256)) throw new Error('A wheel needs its sha256 to be installed');
  await withPipDir(async (dir) => {
    const installed = normalizePackageName(name.distribution);
    if (await wheelOrigin(runtime, installed, dir, options) === 'index') throw new Error(REPLACES_INDEX(installed));
    const copy = join(dir, basename(file));
    await copyFile(file, copy);
    const constraints = await writeConstraints(runtime, dir, options, installed);
    const requirements = join(dir, 'requirements.txt');
    await writeFile(requirements, `${installed} @ ${pathToFileURL(copy).href} --hash=sha256:${sha256}`, 'utf8');
    await runPip(runtime, ['install', ...PIP_FLAGS, '--no-deps', '--no-index', '--require-hashes', '-c', constraints, '-r', requirements], dir, options);
  });
};

export { installWheel };
