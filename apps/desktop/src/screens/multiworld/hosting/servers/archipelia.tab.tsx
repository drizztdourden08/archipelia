/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { ArchipeliaServers } from '../../../../views/ArchipeliaServers';

const meta: ScreenMeta = { title: 'Archipelia servers', icon: 'network', order: 2, keywords: ['lobby', 'lan', 'network', 'admin token', 'certificate', 'reach', 'router'] };

const ArchipeliaServersTab = () => <ArchipeliaServers />;

export default ArchipeliaServersTab;
export { meta };
