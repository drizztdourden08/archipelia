/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { NoSession, RoomWidget } from '../views/SessionDashboard';
import { useSessionView } from '../hooks/useSessionView';

const meta: WidgetMeta = {
  label: 'Room',
  order: 2,
  icon: 'house',
  popOut: true,
  context: 'session',
  defaultVisibility: 'context-only',
  defaultOpen: true,
  defaultSide: 'left',
  defaultDockedSize: 320,
  defaultFloatingSize: { width: 340, height: 300 },
};

const Room = () => {
  const { session, lines } = useSessionView();
  return session ? <RoomWidget session={session} lines={lines} /> : <NoSession />;
};

export default Room;
export { meta };
