/* @layer renderer-app @kind component */
import { defineScreen } from '@drizztdourden08/brock-react';
import { SessionDashboard } from '../views/SessionDashboard';

const sessionScreen = defineScreen({
  id: 'session',
  title: 'Session',
  layer: 'fullscreen',
  render: ({ params }) => <SessionDashboard sessionId={typeof params.sessionId === 'string' ? params.sessionId : ''} />,
});

export { sessionScreen };
