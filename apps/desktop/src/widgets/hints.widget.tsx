/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { HintsWidget, NoSession } from '../views/SessionDashboard';
import { useSessionView } from '../hooks/useSessionView';

const meta: WidgetMeta = {
  label: 'Hints',
  order: 2,
  icon: 'compass',
  popOut: true,
  context: 'session',
  defaultVisibility: 'context-only',
  defaultOpen: true,
  defaultSide: 'top',
  defaultDockedSize: 260,
  defaultFloatingSize: { width: 380, height: 300 },
};

const Hints = () => {
  const { session, lines } = useSessionView();
  return session ? <HintsWidget session={session} lines={lines} /> : <NoSession />;
};

export default Hints;
export { meta };
