/* @layer core @kind logic */
import { playerFileOf } from '@archipelia/model';
import type { HostedPlayer, InstalledGame } from '@archipelia/model';
import type { LibraryView } from './validate-players.type';

const appGameOf = (player: HostedPlayer, { installed }: LibraryView): InstalledGame | undefined => {
  const game = installed.find((entry) => entry.game === player.game);
  return game && playerFileOf(game) === 'app' ? game : undefined;
};

export { appGameOf };
