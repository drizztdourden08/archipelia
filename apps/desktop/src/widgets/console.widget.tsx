/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { ConsoleWidget, NoSession } from '../views/SessionDashboard';
import { useSessionView } from '../hooks/useSessionView';

const meta: WidgetMeta = {
  label: 'Console',
  order: 5,
  icon: 'send',
  popOut: true,
  padding: 'md',
  fill: true,
  context: 'session',
  defaultVisibility: 'context-only',
  defaultOpen: true,
  defaultSide: 'bottom',
  defaultDockedSize: 300,
  defaultFloatingSize: { width: 380, height: 300 },
};

const Console = () => {
  const { session, lines } = useSessionView();
  return session ? <ConsoleWidget session={session} lines={lines} enabled={session.status === 'hosting'} /> : <NoSession />;
};

export default Console;
export { meta };
