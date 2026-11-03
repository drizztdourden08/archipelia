/* @layer renderer-app @kind logic */
import type { InstalledGame } from '@archipelia/model';
import type { SelectOption } from '@drizztdourden08/tessera/primitives';
import { OWN_GAME } from '../SessionLobby.constants';

const missingLabel = (game: string, installed: readonly string[]): string => `${game} (${installed.includes(game) ? 'not allowed' : 'not installed'})`;

const gameOptionsOf = (installed: InstalledGame[], current: string, own = false, allowed: readonly string[] = []): SelectOption[] => {
  const games = installed.map((entry) => entry.game);
  const offered = allowed.length === 0 ? games : games.filter((game) => allowed.includes(game));
  const all = current && !offered.includes(current) ? [...offered, current] : offered;
  const options = [...new Set(all)].sort((a, b) => a.localeCompare(b)).map((game) => ({
    value: game, label: offered.includes(game) ? game : missingLabel(game, games),
  }));
  return own ? [{ value: OWN_GAME, label: 'Their own game' }, ...options] : options;
};

export { gameOptionsOf };
