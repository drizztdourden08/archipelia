/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { DataView } from '../../../views/DataView';

const meta: ScreenMeta = { title: 'Session runs', icon: 'history', order: 1, keywords: ['history', 'clean', 'old runs'] };

const SessionRunsPage = () => <DataView part="runs" />;

export default SessionRunsPage;
export { meta };
