/* @layer core @kind logic */
import type { HostLogLine } from '@archipelia/hosts';
import { NOTICE } from '../live-room/online-from-log.constants';
import { GOAL_REACHED } from './run-end.constants';
import type { TallyState } from './run-end.type';

const noteGoal = ({ goals }: TallyState, { at, text }: HostLogLine) => {
  const [, who] = GOAL_REACHED.exec(text) ?? [];
  const name = who?.replace(NOTICE, '').trim();
  if (name && !(name in goals)) goals[name] = at;
};

export { noteGoal };
