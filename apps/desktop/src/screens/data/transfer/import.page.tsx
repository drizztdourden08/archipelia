/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { DataView } from '../../../views/DataView';

const meta: ScreenMeta = { title: 'Import', icon: 'download', order: 2, keywords: ['restore', 'zip', 'library'] };

const ImportPage = () => <DataView part="import" />;

export default ImportPage;
export { meta };
