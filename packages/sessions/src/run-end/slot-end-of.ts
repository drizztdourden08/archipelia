/* @layer core @kind logic */
import type { RunSlotEnd, SlotEndStatus } from '@archipelia/model';
import type { SlotFacts } from './run-end.type';

const statusOf = ({ goalAt, checked, seen }: SlotFacts): SlotEndStatus => {
  if (goalAt !== undefined) return 'goal';
  if (checked > 0) return 'playing';
  return seen ? 'connected' : 'never';
};

const slotEndOf = (facts: SlotFacts): RunSlotEnd => {
  const { slot, checked, total, goalAt, seen, online, startedAt, endedAt } = facts;
  return {
    slot,
    status: statusOf(facts),
    checked,
    ...(total === undefined ? {} : { total }),
    ...(goalAt === undefined ? {} : { goalAt, goalAfterMs: Math.max(0, goalAt - startedAt) }),
    ...(seen ? { firstSeenAt: seen.first, lastSeenAt: online ? endedAt : seen.last } : {}),
  };
};

export { slotEndOf };
