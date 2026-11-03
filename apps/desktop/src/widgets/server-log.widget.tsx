/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { LobbyLog, NoSession, ServerLogWidget } from '../views/SessionDashboard';
import { useSessionView } from '../hooks/useSessionView';

const meta: WidgetMeta = {
  label: 'Server logs',
  order: 5,
  icon: 'server',
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

const ServerLog = () => {
  const { session, lines, lobby } = useSessionView();
  if (session) return <ServerLogWidget lines={lines} />;
  return lobby ? <LobbyLog events={lobby.events} /> : <NoSession />;
};

export default ServerLog;
export { meta };
