/* @layer electron-main @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import { createRecordStore } from '@archipelia/presets';
import type { ServerEntry } from '@archipelia/model';
import { newId } from '@drizztdourden08/brock-core/storage';
import { SERVERS_DIR } from './server-store.constants';

const createServerStore = (files: FileStore) => {
  const records = createRecordStore<ServerEntry>(files, SERVERS_DIR);

  const save = (entry: ServerEntry) => records.put(entry.id ? entry : { ...entry, id: newId() });

  const require = async (id: string) => {
    const entry = await records.get(id);
    if (!entry) throw new Error(`server ${id} is not in the list`);
    return entry;
  };

  return { ...records, require, save };
};

export { createServerStore };
