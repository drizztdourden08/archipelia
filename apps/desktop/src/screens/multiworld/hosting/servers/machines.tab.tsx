/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { ServerManager } from '../../../../views/ServerManager';

const meta: ScreenMeta = { title: 'Machines', icon: 'hard-drive', order: 1, keywords: ['ssh', 'remote', 'host', 'machine'] };

const MachinesTab = () => <ServerManager />;

export default MachinesTab;
export { meta };
