/* @layer renderer-app @kind logic */
import { isSet, playerFileOf } from '@archipelia/model';
import type { InstalledGame, SessionPlayer } from '@archipelia/model';

const isAppGame = (player: SessionPlayer, installed: InstalledGame[]): boolean => {
  if (!isSet(player)) return false;
  const game = installed.find((entry) => entry.game === player.game);
  return game !== undefined && playerFileOf(game) === 'app';
};

export { isAppGame };
