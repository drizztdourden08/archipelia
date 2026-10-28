/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { LobbyPlayers, NoSession, PlayersWidget } from '../views/SessionDashboard';
import { useSessionView } from '../hooks/useSessionView';

const meta: WidgetMeta = {
  label: 'Players',
  order: 3,
  icon: 'users',
  popOut: true,
  context: 'session',
  defaultVisibility: 'context-only',
  defaultOpen: true,
  defaultSide: 'right',
  defaultDockedSize: 320,
  defaultFloatingSize: { width: 360, height: 300 },
};

const Players = () => {
  const { session, lines, lobby } = useSessionView();
  if (session) return <PlayersWidget session={session} lines={lines} />;
  return lobby ? <LobbyPlayers lobby={lobby} /> : <NoSession />;
};

export default Players;
export { meta };
