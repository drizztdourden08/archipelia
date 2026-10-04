/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { SessionWidget } from '../views/SessionDashboard';

const meta: WidgetMeta = {
  label: 'Console',
  icon: 'send',
  popOut: true,
  defaultVisibility: 'context-only',
  defaultSide: 'bottom',
  defaultDockedSize: 300,
  defaultFloatingSize: { width: 380, height: 300 },
};

const ConsoleWidget = () => <SessionWidget id="console" />;

export default ConsoleWidget;
export { meta };
