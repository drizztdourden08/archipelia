/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { HintsWidget, NoSession } from '../views/SessionDashboard';
import { useSessionView } from '../hooks/useSessionView';

const meta: WidgetMeta = {
  label: 'Hints',
  icon: 'compass',
  popOut: true,
  defaultVisibility: 'context-only',
  defaultSide: 'top',
  defaultDockedSize: 260,
  defaultFloatingSize: { width: 380, height: 300 },
};

const Hints = () => {
  const { session, lines, loaded } = useSessionView();
  return session ? <HintsWidget session={session} lines={lines} /> : <NoSession loaded={loaded} />;
};

export default Hints;
export { meta };
