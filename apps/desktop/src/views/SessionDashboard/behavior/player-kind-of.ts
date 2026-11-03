/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';
import type { PlayerKind } from '../SessionDashboard.type';

const playerKindOf = ({ players, snapshot }: Session, slot: number): PlayerKind => {
  const run = players?.find((player) => player.slot === slot);
  if (run) return run.origin === 'joined' ? 'direct' : 'set';
  return snapshot.players.find((player) => player.slot === slot)?.kind === 'direct' ? 'direct' : 'set';
};

export { playerKindOf };
