/* @layer core @kind logic */
import type { DataFiles, InstalledGame } from '@archipelia/model';
import { JSON_EXT } from './game-records.constants';
import { readInstalled } from './read-installed';

const listInstalled = async (files: DataFiles): Promise<InstalledGame[]> => {
  const names = (await files.list()).map((entry) => entry.name).filter((name) => name.endsWith(JSON_EXT));
  const records = await Promise.all(names.map((name) => readInstalled(files, name.slice(0, -JSON_EXT.length))));
  return records.filter((record): record is InstalledGame => record !== null).sort((a, b) => a.game.localeCompare(b.game));
};

export { listInstalled };
