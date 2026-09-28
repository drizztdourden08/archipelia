/* @layer renderer-app @kind component */
import { defineScreen } from '@drizztdourden08/brock-react';
import { DataView } from '../views/DataView';

const dataScreen = defineScreen({
  id: 'data',
  title: 'Data',
  group: 'app',
  render: () => <DataView />,
});

export { dataScreen };
