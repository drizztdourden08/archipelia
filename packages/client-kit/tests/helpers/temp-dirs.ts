/* @layer tests @kind helper */
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const made: string[] = [];

const makeTempDir = async (): Promise<string> => {
  const dir = await mkdtemp(join(tmpdir(), 'client-kit-'));
  made.push(dir);
  return dir;
};

const cleanTempDirs = async (): Promise<void> => {
  await Promise.all(made.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
};

export { cleanTempDirs, makeTempDir };
