/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';
import type { PlayerView } from '@archipelia/sessions/live-room';
import { checksLabel } from '@archipelia/sessions/live-room';
import type { RunRow } from '../SessionDashboard.type';
import { playerKindOf } from './player-kind-of';
import { progressOf } from './progress-of';
import { ROW_STATUS, ROW_WAITING, RUN_STAGE_TEXT } from './run-stage.constants';

const isWaiting = ({ status, checked }: PlayerView): boolean => (status === 'unknown' || status === 'offline') && !checked;

const kindLabel = (row: PlayerView, session: Session, waiting: boolean): string | undefined => {
  if (waiting) return `${RUN_STAGE_TEXT.set}, ${RUN_STAGE_TEXT.connectAs} ${row.name}`;
  if (!session.snapshot.direct) return undefined;
  return playerKindOf(session, row.slot) === 'direct' ? RUN_STAGE_TEXT.direct : RUN_STAGE_TEXT.set;
};

const runRowOf = (row: PlayerView, session: Session): RunRow => {
  const waiting = isWaiting(row) && playerKindOf(session, row.slot) === 'set';
  const look = waiting ? ROW_WAITING : ROW_STATUS[row.status];
  const done = row.status === 'goal';
  return {
    slot: row.slot,
    name: row.name,
    game: row.game,
    kind: kindLabel(row, session, waiting),
    status: look.label,
    statusTone: look.tone,
    checks: checksLabel(row),
    progress: progressOf(row),
    goal: { label: done ? RUN_STAGE_TEXT.goalDone : RUN_STAGE_TEXT.goalOpen, done },
  };
};

export { runRowOf };
