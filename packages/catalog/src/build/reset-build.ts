/* @layer core @kind logic */
import { mkdir, rm } from 'node:fs/promises';
import type { ActiveBuild } from './build.type';

const resetBuild = async ({ dirs }: ActiveBuild, venv: boolean): Promise<void> => {
  const gone = [dirs.src, dirs.out, ...(venv ? [dirs.venv] : [])];
  await Promise.all(gone.map((dir) => rm(dir, { recursive: true, force: true })));
  await mkdir(dirs.out, { recursive: true });
};

export { resetBuild };
