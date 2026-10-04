/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { SessionWidget } from '../views/SessionDashboard';

const meta: WidgetMeta = {
  label: 'Hints',
  icon: 'compass',
  popOut: true,
  defaultVisibility: 'context-only',
  defaultSide: 'top',
  defaultDockedSize: 260,
  defaultFloatingSize: { width: 380, height: 300 },
};

const HintsWidget = () => <SessionWidget id="hints" />;

export default HintsWidget;
export { meta };
