/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { NoSession } from '../views/SessionDashboard';
import { SpoilerWidget } from '../views/SpoilerWidget';
import { useSessionView } from '../hooks/useSessionView';

const meta: WidgetMeta = {
  label: 'Spoiler',
  order: 8,
  icon: 'eye-off',
  popOut: true,
  padding: 'none',
  fill: true,
  context: 'session',
  defaultVisibility: 'context-only',
  defaultOpen: false,
  defaultSide: 'bottom',
  defaultDockedSize: 300,
  defaultFloatingSize: { width: 560, height: 360 },
};

const Spoiler = () => {
  const { session } = useSessionView();
  return session ? <SpoilerWidget session={session} /> : <NoSession />;
};

export default Spoiler;
export { meta };
