/* @layer core @kind logic */
import type { RunPlayer, SessionTemplate } from '../session.type';

const snapshotPlayersOf = (snapshot: SessionTemplate): RunPlayer[] =>
  snapshot.players.map(({ slot, name, game }) => ({ slot, name, game }));

export { snapshotPlayersOf };
