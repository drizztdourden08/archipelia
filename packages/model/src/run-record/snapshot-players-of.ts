/* @layer core @kind logic */
import { setPlayers } from '../set-players';
import type { RunPlayer, SessionTemplate } from '../session.type';

const snapshotPlayersOf = (snapshot: SessionTemplate): RunPlayer[] =>
  setPlayers(snapshot.players).map(({ slot, name, game }) => ({ slot, name, game }));

export { snapshotPlayersOf };
