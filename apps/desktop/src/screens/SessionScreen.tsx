/* @layer renderer-app @kind component */
import { defineScreen } from '@drizztdourden08/brock-react';
import { BASE_SCREEN } from '../navigation/app-navigation.constants';
import { useFocusStore } from '../state/useFocusStore';
import { SessionDashboard } from '../views/SessionDashboard';

const FocusedSession = () => {
  const sessionId = useFocusStore((state) => state.sessionId);
  return <SessionDashboard sessionId={sessionId} />;
};

const sessionScreen = defineScreen({
  id: BASE_SCREEN,
  title: 'Session',
  render: () => <FocusedSession />,
});

export { sessionScreen };
