/* @layer core @kind logic */
import type { DataFiles, InstalledGame } from '@archipelia/model';
import { recordPath } from './record-path';

const saveInstalled = (files: DataFiles, game: InstalledGame) => files.writeJson(recordPath(game.apworld), game);

export { saveInstalled };
