/* @layer core @kind logic */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative } from 'node:path';
import { zipEntryBytes } from '@archipelia/model/zip';
import { indexArchive } from './index-archive';

const insideOf = (root: string, target: string): boolean => {
  const path = relative(root, target);
  return path !== '' && !path.startsWith('..') && !isAbsolute(path);
};

const unpackArchive = async (file: string, dest: string): Promise<number> => {
  const bytes = new Uint8Array(await readFile(file));
  const entries = indexArchive(bytes);
  await mkdir(dest, { recursive: true });
  for (const { entry, parts, folder } of entries) {
    const target = join(dest, ...parts);
    if (!insideOf(dest, target)) throw new Error(`The source archive holds a path outside its folder: ${parts.join('/').slice(0, 120)}`);
    if (folder) {
      await mkdir(target, { recursive: true });
      continue;
    }
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, zipEntryBytes(bytes, entry), { flag: 'wx' });
  }
  return entries.filter((found) => !found.folder).length;
};

export { unpackArchive };
