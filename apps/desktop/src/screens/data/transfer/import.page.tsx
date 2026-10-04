/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { LibraryImport } from '../../../views/LibraryImport';

const meta: ScreenMeta = { title: 'Import', icon: 'download', order: 2, keywords: ['restore', 'zip', 'library'] };

const ImportPage = () => <LibraryImport />;

export default ImportPage;
export { meta };
