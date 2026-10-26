/* @layer renderer-app @kind logic */
import type { GameRow, GameSummary } from '../GameStore.type';

const summaryOf = (rows: GameRow[], shown: number, apVersion: string | undefined, noRelease: number): GameSummary => ({
  worlds: rows.length,
  installed: rows.filter((row) => row.state !== 'available').length,
  updates: rows.filter((row) => row.state === 'update').length,
  noRelease,
  shown,
  apVersion,
});

export { summaryOf };
