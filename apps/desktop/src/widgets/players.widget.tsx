/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { NoSession, PlayersWidget } from '../views/SessionDashboard';
import { useSessionView } from '../hooks/useSessionView';

const meta: WidgetMeta = {
  label: 'Players',
  order: 1,
  icon: 'users',
  popOut: true,
  context: 'session',
  defaultVisibility: 'context-only',
  defaultOpen: true,
  defaultSide: 'top',
  defaultDockedSize: 260,
  defaultFloatingSize: { width: 360, height: 300 },
};

const Players = () => {
  const { session, lines } = useSessionView();
  return session ? <PlayersWidget session={session} lines={lines} /> : <NoSession />;
};

export default Players;
export { meta };
