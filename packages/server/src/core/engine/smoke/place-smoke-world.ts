/* @layer core @kind logic */
import { installOfficial, listInstalled, readOfficialIndex, removeWorld } from '@archipelia/catalog';
import { ENGINE_DEFAULTS } from '@archipelia/engine';
import type { DataFiles, EngineRuntime } from '@archipelia/model';
import { ENGINE_TEXT } from '@archipelia/engine/install';
import { memoryRecords } from './memory-records';
import type { SmokeWorld } from '@archipelia/engine/install';

const placed = async (files: DataFiles) => (await listInstalled(files)).map((record) => record.apworld);

const removeAll = async (engineDir: string, files: DataFiles, first: string) => {
  let left = (await placed(files)).sort((a, b) => Number(b === first) - Number(a === first));
  while (left.length > 0) {
    const before = left.length;
    for (const apworld of left) await removeWorld({ engineDir, files, apworld }).catch(() => undefined);
    left = await placed(files);
    if (left.length === before) throw new Error(`could not remove the test worlds: ${left.join(', ')}`);
  }
};

const placeSmokeWorld = async (runtime: EngineRuntime, carried: string[]): Promise<SmokeWorld> => {
  const index = await readOfficialIndex(runtime.root);
  const world = ENGINE_DEFAULTS.smokeGames
    .map((game) => index.find((entry) => entry.game === game))
    .find((entry) => entry !== undefined);
  if (!world) throw new Error(ENGINE_TEXT.noSmokeGame);
  if (carried.includes(world.game)) return { game: world.game, remove: () => Promise.resolve() };
  const files = memoryRecords();
  try {
    await installOfficial({ engineDir: runtime.root, files, apworld: world.apworld });
  } catch (err) {
    await removeAll(runtime.root, files, world.apworld).catch(() => undefined);
    throw err;
  }
  return { game: world.game, remove: () => removeAll(runtime.root, files, world.apworld) };
};

export { placeSmokeWorld };
