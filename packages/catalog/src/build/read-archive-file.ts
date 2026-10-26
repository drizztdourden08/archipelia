/* @layer core @kind logic */
import { readFile } from 'node:fs/promises';
import { zipEntryBytes } from '@archipelia/model/zip';
import { indexArchive } from './index-archive';

const readArchiveFile = async (file: string, name: string): Promise<string | undefined> => {
  const bytes = new Uint8Array(await readFile(file));
  const found = indexArchive(bytes).find(({ parts, folder }) => !folder && parts.length === 1 && parts[0] === name);
  return found ? new TextDecoder().decode(zipEntryBytes(bytes, found.entry)) : undefined;
};

export { readArchiveFile };
