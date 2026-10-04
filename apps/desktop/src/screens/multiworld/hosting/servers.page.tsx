/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { ServerManager } from '../../../views/ServerManager';

const meta: ScreenMeta = { title: 'Servers', icon: 'server', order: 1, keywords: ['ssh', 'remote', 'host', 'machine'], menu: 'entry' };

const ServersPage = () => <ServerManager />;

export default ServersPage;
export { meta };
