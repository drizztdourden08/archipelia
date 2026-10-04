/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { DataOverview } from '../../views/DataOverview';

const meta: ScreenMeta = { title: 'Overview', icon: 'hard-drive', order: 1, keywords: ['sizes', 'folder', 'disk'] };

const OverviewPage = () => <DataOverview />;

export default OverviewPage;
export { meta };
