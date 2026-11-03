/* @layer core @kind logic */
import type { RunEnd } from '@archipelia/model';
import type { RunEndInput } from './run-end.type';
import { slotEndOf } from './slot-end-of';
import { tallyOfLines } from './tally-of-lines';

const runEndOf = ({ players, endedAt, reason, tally, lines = [], totals = {} }: RunEndInput): RunEnd | undefined => {
  const counted = tally ?? tallyOfLines(lines, players.map((player) => player.name));
  const { startedAt } = counted;
  if (startedAt === undefined) return undefined;
  const slots = players.map(({ slot, name }) => slotEndOf({
    slot,
    checked: counted.checks[name] ?? 0,
    total: totals[name],
    goalAt: counted.goals[name],
    seen: counted.seen[name],
    online: counted.online[name] ?? false,
    startedAt,
    endedAt,
  }));
  return {
    version: 1,
    reason,
    startedAt,
    endedAt,
    durationMs: Math.max(0, endedAt - startedAt),
    finished: slots.filter((slot) => slot.status === 'goal').length,
    slots,
  };
};

export { runEndOf };
