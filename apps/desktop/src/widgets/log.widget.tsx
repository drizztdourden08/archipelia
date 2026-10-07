/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { LogWidget, NoSession } from '../views/SessionDashboard';
import { useSessionView } from '../hooks/useSessionView';

const meta: WidgetMeta = {
  label: 'Log',
  order: 4,
  icon: 'file-text',
  popOut: true,
  padding: 'none',
  fill: true,
  context: 'session',
  defaultVisibility: 'context-only',
  defaultOpen: true,
  defaultSide: 'bottom',
  defaultDockedSize: 300,
  defaultFloatingSize: { width: 640, height: 320 },
};

const Log = () => {
  const { session, lines } = useSessionView();
  return session ? <LogWidget session={session} lines={lines} /> : <NoSession />;
};

export default Log;
export { meta };
