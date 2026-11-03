/* @layer renderer-app @kind logic */
import { playerFileOf } from '@archipelia/model';
import type { InstalledGame, SessionPlayer } from '@archipelia/model';

const isAppGame = (player: SessionPlayer, installed: InstalledGame[]): boolean => {
  const game = installed.find((entry) => entry.game === player.game);
  return game !== undefined && playerFileOf(game) === 'app';
};

export { isAppGame };
