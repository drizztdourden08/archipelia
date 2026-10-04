/* @layer renderer-app @kind component */
import { Box, Callout, Stack } from '@drizztdourden08/tessera/primitives';
import type { SessionDashboardProps } from './SessionDashboard.type';
import { useSessionDashboard } from './behavior/useSessionDashboard';
import { useLiveRoom } from './behavior/useLiveRoom';
import { useSessionLayoutSeed } from './behavior/useSessionLayoutSeed';
import { useStartOnHome } from './behavior/useStartOnHome';
import { canStop } from './behavior/can-stop';
import { hostLabel } from '@archipelia/model';
import { progressLabel } from './behavior/progress-label';
import { RUN_STATUS, SessionStatusBar } from '@archipelia/design';
import { IdleBase } from './sub-components/IdleBase';
import { SessionSummary } from './sub-components/SessionSummary';
import { resetSessionWidgets } from '../../session-widgets/reset-session-widgets';
import { useFocusStore } from '../../stores/useFocusStore';
import './SessionDashboard.css';

const SessionDashboard = ({ sessionId }: SessionDashboardProps) => {
  const focused = useFocusStore((state) => state.sessionId);
  const board = useSessionDashboard(sessionId ?? focused);
  const live = useLiveRoom(board.session, board.lines);
  useSessionLayoutSeed(board.session !== null);
  useStartOnHome(sessionId === undefined, board.loaded, board.session !== null);

  const { session } = board;
  if (!session) return <IdleBase loaded={board.loaded} />;

  const status = RUN_STATUS[session.status];
  return (
    <Stack gap="md" className="session-dashboard">
      <SessionStatusBar
        status={status.label}
        statusTone={status.tone}
        name={session.snapshot.name}
        host={hostLabel(session.snapshot.host)}
        address={board.address}
        roomUrl={session.endpoint?.roomUrl}
        seed={session.seed}
        uptime={board.uptime}
        progress={progressLabel(board.progress)}
        copied={board.copied}
        stoppable={canStop(session.status)}
        onResetLayout={resetSessionWidgets}
        onCopy={board.copyAddress}
        onStop={board.stopSession}
      />
      {board.error && <Box role="alert"><Callout tone="danger">{board.error}</Callout></Box>}
      {session.error && <Box role="alert"><Callout tone="danger">{session.error}</Callout></Box>}
      <SessionSummary players={live.players} hints={live.hints} phase={live.phase} uptime={board.uptime} status={status.label} />
    </Stack>
  );
};

export { SessionDashboard };
