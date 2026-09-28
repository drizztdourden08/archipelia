/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core/platform';
import type { InstalledGame } from '@archipelia/model';
import { writeJson } from '@drizztdourden08/brock-core/storage';
import { recordPath } from './record-path';

const saveInstalled = (files: FileStore, game: InstalledGame) =>
  writeJson(files, recordPath(game.apworld), game, { trailingNewline: true });

export { saveInstalled };
