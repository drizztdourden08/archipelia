/* @layer core @kind logic */
import { mkdir, rm } from 'node:fs/promises';
import type { ActiveBuild } from './build.type';

const resetBuild = async ({ dirs }: ActiveBuild): Promise<void> => {
  await Promise.all([rm(dirs.src, { recursive: true, force: true }), rm(dirs.out, { recursive: true, force: true })]);
  await mkdir(dirs.out, { recursive: true });
};

export { resetBuild };
