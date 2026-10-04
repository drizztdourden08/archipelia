/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { OldRuns } from '../../views/OldRuns';

const meta: ScreenMeta = { title: 'Old runs', icon: 'history', order: 2, keywords: ['session runs', 'clean', 'old runs'] };

const OldRunsPage = () => <OldRuns />;

export default OldRunsPage;
export { meta };
