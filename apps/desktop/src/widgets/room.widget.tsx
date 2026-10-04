/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { SessionWidget } from '../views/SessionDashboard';

const meta: WidgetMeta = {
  label: 'Room',
  icon: 'house',
  popOut: true,
  defaultVisibility: 'context-only',
  defaultSide: 'top',
  defaultDockedSize: 260,
  defaultFloatingSize: { width: 340, height: 300 },
};

const RoomWidget = () => <SessionWidget id="room" />;

export default RoomWidget;
export { meta };
