/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { LogWidget, NoSession } from '../views/SessionDashboard';
import { useSessionView } from '../hooks/useSessionView';

const meta: WidgetMeta = {
  label: 'Log',
  icon: 'file-text',
  popOut: true,
  defaultVisibility: 'context-only',
  defaultSide: 'bottom',
  defaultDockedSize: 300,
  defaultFloatingSize: { width: 640, height: 320 },
};

const Log = () => {
  const { session, lines, loaded } = useSessionView();
  return session ? <LogWidget session={session} lines={lines} /> : <NoSession loaded={loaded} />;
};

export default Log;
export { meta };
