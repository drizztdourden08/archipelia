/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { SessionWidget } from '../views/SessionDashboard';

const meta: WidgetMeta = {
  label: 'Spoiler',
  icon: 'eye-off',
  popOut: true,
  defaultVisibility: 'context-only',
  defaultSide: 'right',
  defaultDockedSize: 420,
  defaultFloatingSize: { width: 560, height: 360 },
};

const SpoilerWidget = () => <SessionWidget id="spoiler" />;

export default SpoilerWidget;
export { meta };
