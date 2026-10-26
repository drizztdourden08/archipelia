/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { StoragePage } from '@drizztdourden08/brock-react';

const meta: ScreenMeta = { title: 'Storage', icon: 'hard-drive', order: 3, keywords: ['sizes', 'folder', 'disk', 'export', 'import', 'backup', 'zip'], showHeader: true };

const StorageScreen = () => <StoragePage />;

export default StorageScreen;
export { meta };
