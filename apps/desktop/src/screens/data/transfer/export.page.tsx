/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { DataView } from '../../../views/DataView';

const meta: ScreenMeta = { title: 'Export', icon: 'upload', order: 1, keywords: ['backup', 'zip', 'library'] };

const ExportPage = () => <DataView part="export" />;

export default ExportPage;
export { meta };
