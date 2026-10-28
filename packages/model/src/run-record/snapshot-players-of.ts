/* @layer core @kind logic */
import { hostedPlayers } from '../hosted-players';
import type { RunPlayer, SessionTemplate } from '../session.type';

const snapshotPlayersOf = (snapshot: SessionTemplate): RunPlayer[] =>
  hostedPlayers(snapshot.players).map(({ slot, name, game }) => ({ slot, name, game }));

export { snapshotPlayersOf };
