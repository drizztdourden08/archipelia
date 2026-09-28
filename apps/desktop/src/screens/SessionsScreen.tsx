/* @layer renderer-app @kind component */
import { defineScreen } from '@drizztdourden08/brock-react';
import { SessionsLibrary } from '../views/SessionsLibrary';

const sessionsScreen = defineScreen({
  id: 'sessions',
  title: 'Sessions',
  group: 'library',
  render: () => <SessionsLibrary />,
});

export { sessionsScreen };
