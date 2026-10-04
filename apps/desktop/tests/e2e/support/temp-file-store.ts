/* @layer tests @kind helper */
import { mkdir, mkdtemp, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import type { DataFiles } from '@archipelia/model';

const orNull = async <T>(work: () => Promise<T>) => {
  try {
    return await work();
  } catch {
    return null;
  }
};

const dataFilesAt = (root: string): DataFiles => {
  const at = (path = '') => join(root, path);
  const write = async (path: string, data: string | Uint8Array) => {
    await mkdir(dirname(at(path)), { recursive: true });
    await writeFile(at(path), data);
  };
  const readText = (path: string) => orNull(() => readFile(at(path), 'utf8'));
  return {
    path: at,
    readBytes: (path) => orNull(async () => new Uint8Array(await readFile(at(path)))),
    readText,
    readJson: async <T>(path: string, fallback: T) => {
      const text = await readText(path);
      return text === null ? fallback : (JSON.parse(text) as T);
    },
    writeJson: (path, value) => write(path, `${JSON.stringify(value, null, 2)}\n`),
    writeBytes: write,
    writeText: write,
    list: async (path) => ((await orNull(() => readdir(at(path), { withFileTypes: true }))) ?? [])
      .map((entry) => ({ name: entry.name, isDirectory: entry.isDirectory() })),
    remove: (path) => rm(at(path), { recursive: true, force: true }),
    exists: async (path) => (await orNull(() => stat(at(path)))) !== null,
  };
};

const tempDataRoot = () => mkdtemp(join(tmpdir(), 'archipelia-e2e-'));

export { dataFilesAt, tempDataRoot };
