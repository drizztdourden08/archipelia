/* @layer core @kind logic */
import { createRecordStore } from '@archipelia/presets';
import type { DataFiles, ServerEntry } from '@archipelia/model';
import { newId } from '@drizztdourden08/brock-core/storage';

const createServerStore = (files: DataFiles) => {
  const records = createRecordStore<ServerEntry>(files);

  const save = (entry: ServerEntry) => records.put(entry.id ? entry : { ...entry, id: newId() });

  const require = async (id: string) => {
    const entry = await records.get(id);
    if (!entry) throw new Error(`server ${id} is not in the list`);
    return entry;
  };

  return { ...records, require, save };
};

export { createServerStore };
