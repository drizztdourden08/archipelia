/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { LibraryExport } from '../../../views/LibraryExport';

const meta: ScreenMeta = { title: 'Export', icon: 'upload', order: 1, keywords: ['backup', 'zip', 'library'] };

const ExportPage = () => <LibraryExport />;

export default ExportPage;
export { meta };
