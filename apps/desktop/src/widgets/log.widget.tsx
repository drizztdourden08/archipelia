/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { SessionWidget } from '../views/SessionDashboard';

const meta: WidgetMeta = {
  label: 'Log',
  icon: 'file-text',
  popOut: true,
  defaultVisibility: 'context-only',
  defaultSide: 'bottom',
  defaultDockedSize: 300,
  defaultFloatingSize: { width: 640, height: 320 },
};

const LogWidget = () => <SessionWidget id="log" />;

export default LogWidget;
export { meta };
