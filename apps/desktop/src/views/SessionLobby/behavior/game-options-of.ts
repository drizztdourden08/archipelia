/* @layer renderer-app @kind logic */
import type { InstalledGame } from '@archipelia/model';
import type { SelectOption } from '@drizztdourden08/tessera/primitives';
import { OWN_GAME } from '../SessionLobby.constants';

const gameOptionsOf = (installed: InstalledGame[], current: string, own = false): SelectOption[] => {
  const games = installed.map((entry) => entry.game);
  const all = current && !games.includes(current) ? [...games, current] : games;
  const options = [...new Set(all)].sort((a, b) => a.localeCompare(b)).map((game) => ({
    value: game, label: games.includes(game) ? game : `${game} (not installed)`,
  }));
  return own ? [{ value: OWN_GAME, label: 'Their own game' }, ...options] : options;
};

export { gameOptionsOf };
