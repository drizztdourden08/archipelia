/* @layer renderer-app @kind component */
import { defineScreen } from '@drizztdourden08/brock-react';
import { ServerManager } from '../views/ServerManager';

const serversScreen = defineScreen({
  id: 'servers',
  title: 'Servers',
  group: 'library',
  render: () => <ServerManager />,
});

export { serversScreen };
