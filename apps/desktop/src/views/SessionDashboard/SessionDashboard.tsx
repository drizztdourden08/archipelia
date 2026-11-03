/* @layer renderer-app @kind component */
import { EmptyState, Spinner, Stack } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout, LobbyStage } from '@archipelia/design';
import { hostLabel } from '@archipelia/model';
import type { SessionDashboardProps } from './SessionDashboard.type';
import { useSessionDashboard } from './behavior/useSessionDashboard';
import { useLiveRoom } from './behavior/useLiveRoom';
import { canStop } from './behavior/can-stop';
import { runCodes } from './behavior/run-codes';
import { runConfig } from './behavior/run-config';
import { RunActions } from './sub-components/RunActions';
import { RunChips } from './sub-components/RunChips';
import { RunPlayers } from './sub-components/RunPlayers';
import { RunProgress } from './sub-components/RunProgress';
import { useLoggedFailure } from '../../hooks/useLoggedFailure';
import { FAILURE, LOADING_RUN } from './SessionDashboard.constants';
import './SessionDashboard.css';

const SessionDashboard = ({ sessionId }: SessionDashboardProps) => {
  const board = useSessionDashboard(sessionId);
  const live = useLiveRoom(board.session, board.lines);
  const runFailure = useLoggedFailure(board.session?.error, FAILURE.run);

  const { session } = board;
  if (!session) return <EmptyState icon={<Spinner />} message={LOADING_RUN} />;

  const { snapshot } = session;
  const chips = (
    <RunChips
      status={session.status}
      job={board.progress}
      place={hostLabel(snapshot.host)}
      lan={snapshot.lan === true}
      count={live.players.length || snapshot.players.length}
      uptime={board.uptime}
    />
  );
  return (
    <Stack gap="md" className="session-dashboard">
      <LobbyStage
        title={snapshot.name}
        chips={chips}
        actions={<RunActions address={board.address} stoppable={canStop(session.status)} onStop={board.stopSession} />}
        codes={runCodes(board.address, session.seed)}
        config={runConfig(snapshot)}
      >
        <RunProgress job={board.progress} />
        {board.error && <ErrorCallout message={board.error} />}
        {runFailure && <ErrorCallout message={runFailure} />}
        <RunPlayers session={session} rows={live.players} />
      </LobbyStage>
    </Stack>
  );
};

export { SessionDashboard };
