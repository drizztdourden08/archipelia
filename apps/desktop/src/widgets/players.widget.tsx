/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { NoSession, PlayersWidget } from '../views/SessionDashboard';
import { useSessionView } from '../hooks/useSessionView';

const meta: WidgetMeta = {
  label: 'Players',
  icon: 'users',
  popOut: true,
  defaultVisibility: 'context-only',
  defaultSide: 'top',
  defaultDockedSize: 260,
  defaultFloatingSize: { width: 360, height: 300 },
};

const Players = () => {
  const { session, lines, loaded } = useSessionView();
  return session ? <PlayersWidget session={session} lines={lines} /> : <NoSession loaded={loaded} />;
};

export default Players;
export { meta };
