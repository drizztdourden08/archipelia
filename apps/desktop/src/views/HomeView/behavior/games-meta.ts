/* @layer renderer-app @kind logic */
import type { InstalledGame } from '@archipelia/model';
import { NAMED_GAMES } from '../HomeView.constants';

const gamesMeta = (installed: readonly InstalledGame[]) => {
  if (installed.length === 0) return 'none installed yet';
  const names = installed.slice(0, NAMED_GAMES).map((game) => game.game).join(' · ');
  return installed.length > NAMED_GAMES ? `${names} +${installed.length - NAMED_GAMES}` : names;
};

export { gamesMeta };
