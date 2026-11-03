/* @layer core @kind logic */
import type { InstalledGame, PlayerFile } from './game.type';
import { PRE_ROLLED_KEY } from './player-file-of.constants';

const playerFileOf = ({ playerFile, schema }: Pick<InstalledGame, 'playerFile' | 'schema'>): PlayerFile => {
  if (playerFile !== undefined) return playerFile;
  return schema.options.some((option) => option.key === PRE_ROLLED_KEY) ? 'app' : 'options';
};

export { playerFileOf };
