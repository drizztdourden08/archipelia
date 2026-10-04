/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { OldRuns } from '../../../views/OldRuns';

const meta: ScreenMeta = { title: 'Runs', icon: 'history', order: 1, keywords: ['session runs', 'clean', 'old runs'] };

const SessionRunsPage = () => <OldRuns />;

export default SessionRunsPage;
export { meta };
