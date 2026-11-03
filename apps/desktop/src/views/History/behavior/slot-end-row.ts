/* @layer renderer-app @kind logic */
import type { RunSlotEnd } from '@archipelia/model';
import { DATE_FORMAT, END_STATUS, NO_VALUE } from '../History.constants';
import type { EndFacts } from '../History.type';
import { lengthText } from './length-text';

const checksText = ({ checked, total }: RunSlotEnd): string => (total === undefined ? String(checked) : `${checked} / ${total}`);

const goalText = ({ goalAt, goalAfterMs }: RunSlotEnd): string =>
  (goalAt === undefined ? NO_VALUE : `${DATE_FORMAT.format(goalAt)}, after ${lengthText(goalAfterMs ?? 0)}`);

const slotEndRow = (end: RunSlotEnd | undefined): EndFacts => {
  if (!end) return { status: NO_VALUE, tone: null, checks: NO_VALUE, goal: NO_VALUE };
  const { label, tone } = END_STATUS[end.status];
  return { status: label, tone, checks: checksText(end), goal: goalText(end) };
};

export { slotEndRow };
