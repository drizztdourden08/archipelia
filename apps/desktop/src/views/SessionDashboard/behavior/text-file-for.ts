/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';
import type { LogTab } from '../SessionDashboard.type';
import { GENERATE_LOG } from '../SessionDashboard.constants';

const textFileFor = (tab: LogTab, session: Session): string | null => {
  if (tab === 'generate') return GENERATE_LOG;
  if (tab === 'spoiler') return session.output?.spoiler ?? null;
  return null;
};

export { textFileFor };
