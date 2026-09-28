/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import { assertSafeName, readJson, writeJson } from '@drizztdourden08/brock-core/storage';
import type { StoredRecord } from './record-store.type';
import { JSON_EXT } from './record-store.constants';

const createRecordStore = <T extends StoredRecord>(files: FileStore, dir: string) => {
  const pathOf = (id: string) => `${dir}/${assertSafeName(id, 'record id')}${JSON_EXT}`;

  const get = (id: string): Promise<T | null> => readJson<T | null>(files, pathOf(id), null);

  const list = async (): Promise<T[]> => {
    const names = (await files.list(dir)).filter((name) => name.endsWith(JSON_EXT));
    const records: (T | null)[] = await Promise.all(names.map((name) => get(name.slice(0, -JSON_EXT.length))));
    return records.filter((record): record is T => record !== null);
  };

  const put = async (record: T) => {
    await writeJson(files, pathOf(record.id), record, { trailingNewline: true });
    return record;
  };

  const remove = (id: string) => files.remove(pathOf(id));

  return { get, list, put, remove };
};

export { createRecordStore };
