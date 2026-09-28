/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';
import type { LogTab } from '../SessionDashboard.type';

const logTabsFor = (session: Session): LogTab[] => (session.output?.spoiler ? ['server', 'generate', 'spoiler'] : ['server', 'generate']);

export { logTabsFor };
