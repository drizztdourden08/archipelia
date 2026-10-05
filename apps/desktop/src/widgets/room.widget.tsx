/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { NoSession, RoomWidget } from '../views/SessionDashboard';
import { useSessionView } from '../hooks/useSessionView';

const meta: WidgetMeta = {
  label: 'Room',
  order: 3,
  icon: 'house',
  popOut: true,
  defaultVisibility: 'context-only',
  defaultOpen: true,
  defaultSide: 'top',
  defaultDockedSize: 260,
  defaultFloatingSize: { width: 340, height: 300 },
};

const Room = () => {
  const { session, lines } = useSessionView();
  return session ? <RoomWidget session={session} lines={lines} /> : <NoSession />;
};

export default Room;
export { meta };
