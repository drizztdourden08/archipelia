/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { DataView } from '../../views/DataView';

const meta: ScreenMeta = { title: 'Overview', icon: 'hard-drive', order: 1, keywords: ['sizes', 'folder', 'disk'] };

const OverviewPage = () => <DataView part="overview" />;

export default OverviewPage;
export { meta };
