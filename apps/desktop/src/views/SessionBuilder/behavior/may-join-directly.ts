/* @layer renderer-app @kind logic */
import type { InstalledGame, SessionPlayer } from '@archipelia/model';
import { gamesOf } from './games-of';
import { installedOf } from './installed-of';

const mayJoinDirectly = (players: readonly SessionPlayer[], installed: readonly InstalledGame[]): boolean =>
  gamesOf(players).some((game) => installedOf(game, installed)?.source === 'first-party');

export { mayJoinDirectly };
