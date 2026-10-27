/* @layer core @kind logic */
import type { Session, SessionTemplate, StoredRun } from '../session.type';
import { templateOf } from '../template-of';
import { runSourceOf } from './run-source-of';
import { snapshotPlayersOf } from './snapshot-players-of';

const runOf = (stored: StoredRun, templates: readonly SessionTemplate[]): Session => {
  const snapshot = templateOf(stored.snapshot);
  return {
    ...stored,
    snapshot,
    source: stored.source ?? runSourceOf({ ...stored, snapshot }, templates),
    players: stored.players ?? snapshotPlayersOf(snapshot),
  };
};

export { runOf };
