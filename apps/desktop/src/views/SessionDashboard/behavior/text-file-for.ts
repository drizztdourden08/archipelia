/* @layer renderer-app @kind logic */
import type { LogTab } from '../SessionDashboard.type';
import { GENERATE_LOG } from '../SessionDashboard.constants';

const textFileFor = (tab: LogTab): string | null => (tab === 'generate' ? GENERATE_LOG : null);

export { textFileFor };
