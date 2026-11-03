/* @layer core @kind logic */
import type { HostLogLine } from '@archipelia/hosts';
import { NOTICE } from '../live-room/online-from-log.constants';
import { GOAL_REACHED } from './run-end.constants';

const goalsFromLog = (lines: readonly HostLogLine[]): Record<string, number> => {
  const goals: Record<string, number> = {};
  lines.forEach(({ at, text }) => {
    const [, who] = GOAL_REACHED.exec(text) ?? [];
    const name = who?.replace(NOTICE, '').trim();
    if (name && !(name in goals)) goals[name] = at;
  });
  return goals;
};

export { goalsFromLog };
