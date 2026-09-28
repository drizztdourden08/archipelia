/* @layer tests @kind helper */
import { mkdir, mkdtemp, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import type { FileStore } from '@drizztdourden08/brock-core/platform';

const orNull = async <T>(work: () => Promise<T>) => {
  try {
    return await work();
  } catch {
    return null;
  }
};

const fileStoreAt = (root: string): FileStore => {
  const at = (path: string) => join(root, path);
  const write = async (path: string, data: string | Uint8Array) => {
    await mkdir(dirname(at(path)), { recursive: true });
    await writeFile(at(path), data);
  };
  return {
    readBytes: (path) => orNull(async () => new Uint8Array(await readFile(at(path)))),
    readText: (path) => orNull(() => readFile(at(path), 'utf8')),
    writeBytes: write,
    writeText: write,
    list: async (path) => (await orNull(() => readdir(at(path)))) ?? [],
    remove: (path) => rm(at(path), { recursive: true, force: true }),
    exists: async (path) => (await orNull(() => stat(at(path)))) !== null,
    mkdir: async (path) => { await mkdir(at(path), { recursive: true }); },
    stat: async (path) => {
      const found = await orNull(() => stat(at(path)));
      return found && { bytes: found.size, isDirectory: found.isDirectory(), mtimeMs: found.mtimeMs };
    },
  };
};

const tempDataRoot = () => mkdtemp(join(tmpdir(), 'archipelia-e2e-'));

export { fileStoreAt, tempDataRoot };
