/* @layer renderer-app @kind component */
import { useNavigation } from '@drizztdourden08/brock-react';
import { useCallback } from 'react';
import { Button, EmptyState, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { SessionDashboardProps } from './SessionDashboard.type';
import { useSessionDashboard } from './behavior/useSessionDashboard';
import { useLiveRoom } from './behavior/useLiveRoom';
import { useSessionDock } from './behavior/useSessionDock';
import { canStop } from './behavior/can-stop';
import { hostLabel } from './behavior/host-label';
import { progressLabel } from './behavior/progress-label';
import { statusView } from './behavior/status-view';
import { SessionStatusBar } from '../../compounds/SessionStatusBar';
import { SessionSummary } from './sub-components/SessionSummary';
import { SessionWidgets } from './sub-components/SessionWidgets';
import './SessionDashboard.css';

const SessionDashboard = ({ sessionId }: SessionDashboardProps) => {
  const board = useSessionDashboard(sessionId);
  const live = useLiveRoom(board.session, board.lines);
  const dock = useSessionDock();
  const { open } = useNavigation();
  const openSessions = useCallback(() => open('sessions'), [open]);

  const { session } = board;
  if (!session) {
    const message = board.loaded ? 'No room is hosting right now. Start one from Sessions.' : 'Loading sessions';
    return <EmptyState message={message} action={<Button variant="primary" onClick={openSessions}>Open Sessions</Button>} />;
  }

  const status = statusView(session.status);
  return (
    <Stack gap="md" className="session-dashboard">
      <SessionStatusBar
        status={status.label}
        statusVariant={status.variant}
        name={session.snapshot.name}
        host={hostLabel(session.snapshot.host)}
        address={board.address}
        roomUrl={session.endpoint?.roomUrl}
        seed={session.seed}
        uptime={board.uptime}
        progress={progressLabel(board.progress)}
        copied={board.copied}
        stoppable={canStop(session.status)}
        widgets={dock.toggles}
        onToggleWidget={dock.toggle}
        onResetLayout={dock.reset}
        onCopy={board.copyAddress}
        onStop={board.stopSession}
      />
      {board.error && <Text variant="body" role="alert">{board.error}</Text>}
      {session.error && <Text variant="body" role="alert">{session.error}</Text>}
      <SessionSummary players={live.players} hints={live.hints} phase={live.phase} uptime={board.uptime} status={status.label} />
      <SessionWidgets session={session} lines={board.lines} live={live} layout={dock.layout} onUpdate={dock.update} onClose={dock.close} />
    </Stack>
  );
};

export { SessionDashboard };
