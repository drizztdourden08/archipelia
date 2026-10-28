/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { LobbyLog, LogWidget, NoSession } from '../views/SessionDashboard';
import { useSessionView } from '../hooks/useSessionView';

const meta: WidgetMeta = {
  label: 'Log',
  order: 5,
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
  const { session, lines, lobby } = useSessionView();
  if (session) return <LogWidget session={session} lines={lines} />;
  return lobby ? <LobbyLog events={lobby.events} /> : <NoSession />;
};

export default Log;
export { meta };
