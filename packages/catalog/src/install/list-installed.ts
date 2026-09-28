/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { InstalledGame } from '@archipelia/model';
import { GAMES_DIR, JSON_EXT } from './game-records.constants';
import { readInstalled } from './read-installed';

const listInstalled = async (files: FileStore): Promise<InstalledGame[]> => {
  const names = (await files.list(GAMES_DIR)).filter((name) => name.endsWith(JSON_EXT));
  const records = await Promise.all(names.map((name) => readInstalled(files, name.slice(0, -JSON_EXT.length))));
  return records.filter((record): record is InstalledGame => record !== null).sort((a, b) => a.game.localeCompare(b.game));
};

export { listInstalled };
