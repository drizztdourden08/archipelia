/* @layer core @kind logic */
import { isRecord, isStringList } from '@archipelia/model';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { OfficialWorld } from './official-index.type';
import { officialDir } from './official-dir';
import { INDEX_FILE } from './official-index.constants';

const isOfficialWorld = (value: unknown): value is OfficialWorld =>
  isRecord(value) && ['apworld', 'game', 'file', 'sha256'].every((key) => typeof value[key] === 'string')
  && (value.layout === 'apworld' || value.layout === 'folder') && isStringList(value.requires) && isStringList(value.optional);

const readOfficialIndex = async (engineDir: string): Promise<OfficialWorld[]> => {
  const dir = await officialDir(engineDir);
  const value: unknown = JSON.parse(await readFile(join(dir, INDEX_FILE), 'utf8'));
  if (!Array.isArray(value) || !value.every(isOfficialWorld)) throw new Error(`${INDEX_FILE} does not have the expected shape`);
  return value;
};

export { readOfficialIndex };
