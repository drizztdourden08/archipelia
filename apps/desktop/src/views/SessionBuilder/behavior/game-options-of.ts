/* @layer renderer-app @kind logic */
import type { InstalledGame } from '@archipelia/model';
import type { SelectOption } from '@drizztdourden08/tessera/primitives';

const gameOptionsOf = (installed: InstalledGame[], current: string): SelectOption[] => {
  const games = installed.map((entry) => entry.game);
  const all = current && !games.includes(current) ? [...games, current] : games;
  return [...new Set(all)].sort((a, b) => a.localeCompare(b)).map((game) => ({
    value: game, label: games.includes(game) ? game : `${game} (not installed)`,
  }));
};

export { gameOptionsOf };
