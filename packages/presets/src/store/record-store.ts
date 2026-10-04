/* @layer core @kind logic */
import type { DataFiles } from '@archipelia/model';
import { assertSafeName } from '@drizztdourden08/brock-core/storage';
import type { StoredRecord } from './record-store.type';
import { JSON_EXT } from './record-store.constants';

const createRecordStore = <T extends StoredRecord>(files: DataFiles, dir = '') => {
  const pathOf = (id: string) => `${dir ? `${dir}/` : ''}${assertSafeName(id, 'record id')}${JSON_EXT}`;

  const get = (id: string): Promise<T | null> => files.readJson<T | null>(pathOf(id), null).catch(() => null);

  const list = async (): Promise<T[]> => {
    const names = (await files.list(dir)).map((entry) => entry.name).filter((name) => name.endsWith(JSON_EXT));
    const records: (T | null)[] = await Promise.all(names.map((name) => get(name.slice(0, -JSON_EXT.length))));
    return records.filter((record): record is T => record !== null);
  };

  const put = async (record: T) => {
    await files.writeJson(pathOf(record.id), record);
    return record;
  };

  const remove = (id: string) => files.remove(pathOf(id));

  return { get, list, put, remove };
};

export { createRecordStore };
