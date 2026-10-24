/* @layer core @kind logic */
import { lstat, mkdir, open, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { ZIP_LIMITS } from '@archipelia/model/zip';
import { ARCHIVE_NAME, READ_NO_FOLLOW } from './produce-session.constants';

const plainFolder = async (path: string) => {
  const stat = await lstat(path);
  if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error('the generator output folder was replaced');
};

const plainFile = async (path: string) => {
  const stat = await lstat(path);
  if (stat.isSymbolicLink() || !stat.isFile()) throw new Error('the generator archive is not a plain file');
  if (stat.size > ZIP_LIMITS.totalBytes) throw new Error('the generator archive is larger than this server takes');
};

const releaseZip = async (fromDir: string, reported: string, toDir: string): Promise<string> => {
  const name = basename(reported.replace(/\\/g, '/'));
  if (!ARCHIVE_NAME.test(name)) throw new Error(`the generator named an unexpected archive ${name}`);
  await plainFolder(fromDir);
  const source = join(fromDir, name);
  await plainFile(source);
  const handle = await open(source, READ_NO_FOLLOW);
  try {
    const bytes = await handle.readFile();
    await mkdir(toDir, { recursive: true });
    await writeFile(join(toDir, name), bytes, { flag: 'wx' });
  } finally {
    await handle.close();
  }
  return name;
};

export { releaseZip };
