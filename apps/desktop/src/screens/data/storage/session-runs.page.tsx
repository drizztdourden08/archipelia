/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { OldRuns } from '../../../views/OldRuns';

const meta: ScreenMeta = { title: 'Session runs', icon: 'history', order: 1, keywords: ['history', 'clean', 'old runs'] };

const SessionRunsPage = () => <OldRuns />;

export default SessionRunsPage;
export { meta };
