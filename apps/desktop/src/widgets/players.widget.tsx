/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { SessionWidget } from '../views/SessionDashboard';

const meta: WidgetMeta = {
  label: 'Players',
  icon: 'users',
  popOut: true,
  defaultVisibility: 'context-only',
  defaultSide: 'top',
  defaultDockedSize: 260,
  defaultFloatingSize: { width: 360, height: 300 },
};

const PlayersWidget = () => <SessionWidget id="players" />;

export default PlayersWidget;
export { meta };
