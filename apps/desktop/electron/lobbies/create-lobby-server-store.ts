/* @layer electron-main @kind logic */
import type { DataFiles, LobbyServerEntry } from '@archipelia/model';
import { createRecordStore } from '@archipelia/presets';
import { newId } from '@drizztdourden08/brock-core/storage';

const createLobbyServerStore = (files: DataFiles) => {
  const records = createRecordStore<LobbyServerEntry>(files);

  const save = (entry: LobbyServerEntry) => records.put(entry.id ? entry : { ...entry, id: newId() });

  const require = async (id: string): Promise<LobbyServerEntry> => {
    const entry = await records.get(id);
    if (!entry) throw new Error('This Archipelia server is not in the list.');
    return entry;
  };

  return { ...records, require, save };
};

export { createLobbyServerStore };
