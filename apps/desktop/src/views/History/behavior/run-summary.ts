/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';
import { lengthText } from './length-text';

const runSummary = ({ end }: Session): string | null =>
  (end ? `${end.finished} of ${end.slots.length} finished, ${lengthText(end.durationMs)}` : null);

export { runSummary };
