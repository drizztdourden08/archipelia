/* @layer renderer-app @kind component */
import { EmptyState, Spinner, Stack } from '@drizztdourden08/tessera/primitives';
import type { SessionDashboardProps } from './SessionDashboard.type';
import { useSessionDashboard } from './behavior/useSessionDashboard';
import { useLiveRoom } from './behavior/useLiveRoom';
import { canStop } from './behavior/can-stop';
import { hostLabel } from '@archipelia/model';
import { progressLabel } from './behavior/progress-label';
import { ErrorCallout, RUN_STATUS, SessionStatusBar } from '@archipelia/design';
import { SessionSummary } from './sub-components/SessionSummary';
import { useLoggedFailure } from '../../hooks/useLoggedFailure';
import { FAILURE, LOADING_RUN } from './SessionDashboard.constants';
import './SessionDashboard.css';

const SessionDashboard = ({ sessionId }: SessionDashboardProps) => {
  const board = useSessionDashboard(sessionId);
  const live = useLiveRoom(board.session, board.lines);
  const runFailure = useLoggedFailure(board.session?.error, FAILURE.run);

  const { session } = board;
  if (!session) return <EmptyState icon={<Spinner />} message={LOADING_RUN} />;

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
        onCopy={board.copyAddress}
        onStop={board.stopSession}
      />
      {board.error && <ErrorCallout message={board.error} />}
      {runFailure && <ErrorCallout message={runFailure} />}
      <SessionSummary players={live.players} hints={live.hints} phase={live.phase} uptime={board.uptime} status={status.label} />
    </Stack>
  );
};

export { SessionDashboard };
