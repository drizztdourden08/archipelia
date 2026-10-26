/* @layer core @kind logic */
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { assertSafeName } from '@drizztdourden08/brock-core/storage';

const withTempFile = async <T,>(fileName: string, bytes: Uint8Array, work: (path: string) => Promise<T>): Promise<T> => {
  const dir = await mkdtemp(join(tmpdir(), 'archipelia-apworld-'));
  try {
    const path = join(dir, assertSafeName(fileName, 'file name'));
    await writeFile(path, bytes);
    return await work(path);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
};

export { withTempFile };
