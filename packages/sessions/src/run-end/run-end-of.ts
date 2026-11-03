/* @layer core @kind logic */
import type { RunEnd } from '@archipelia/model';
import { checksFromLog } from '../live-room/log-checks';
import { onlineFromLog } from '../live-room/online-from-log';
import { goalsFromLog } from './goals-from-log';
import type { RunEndInput } from './run-end.type';
import { seenFromLog } from './seen-from-log';
import { slotEndOf } from './slot-end-of';

const runEndOf = ({ players, lines, endedAt, totals = {} }: RunEndInput): RunEnd | undefined => {
  const first = lines[0];
  if (!first) return undefined;
  const startedAt = first.at;
  const names = players.map((player) => player.name);
  const texts = lines.map((line) => line.text);
  const checks = checksFromLog(texts, names);
  const online = onlineFromLog(texts);
  const goals = goalsFromLog(lines);
  const seen = seenFromLog(lines);
  const slots = players.map(({ slot, name }) => slotEndOf({
    slot,
    checked: checks[name] ?? 0,
    total: totals[name],
    goalAt: goals[name],
    seen: seen[name],
    online: online[name] ?? false,
    startedAt,
    endedAt,
  }));
  return {
    version: 1,
    startedAt,
    endedAt,
    durationMs: Math.max(0, endedAt - startedAt),
    finished: slots.filter((slot) => slot.status === 'goal').length,
    slots,
  };
};

export { runEndOf };
