/* @layer core @kind logic */
import type { DataFiles, GamePreset } from '@archipelia/model';
import { newId } from '@drizztdourden08/brock-core/storage';
import { createRecordStore } from './record-store';
import type { PresetInput } from './preset-store.type';

const createPresetStore = (files: DataFiles) => {
  const records = createRecordStore<GamePreset>(files);

  const listForGame = async (game: string) => (await records.list()).filter((preset) => preset.game === game);

  const create = ({ game, name, values = {} }: PresetInput) =>
    records.put({ id: newId(), game, name, values, updatedAt: Date.now() });

  const save = (preset: GamePreset) => records.put({ ...preset, updatedAt: Date.now() });

  const duplicate = async (id: string, name: string) => {
    const source = await records.get(id);
    if (!source) throw new Error(`preset ${id} not found`);
    return create({ game: source.game, name, values: { ...source.values } });
  };

  return { ...records, create, duplicate, listForGame, save };
};

export { createPresetStore };
