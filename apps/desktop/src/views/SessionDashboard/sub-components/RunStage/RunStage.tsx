/* @layer renderer-app @kind component */
import { ErrorCallout } from '@archipelia/design';
import { hostLabel } from '@archipelia/model';
import { useLoggedFailure } from '../../../../hooks/useLoggedFailure';
import { canStop } from '../../behavior/can-stop';
import { runCodes } from '../../behavior/run-codes';
import { runConfig } from '../../behavior/run-config';
import { useLiveRoom } from '../../behavior/useLiveRoom';
import { useSessionDashboard } from '../../behavior/useSessionDashboard';
import { FAILURE } from '../../SessionDashboard.constants';
import { RunActions } from '../RunActions';
import { RunChips } from '../RunChips';
import { RunPlayers } from '../RunPlayers';
import { RunProgress } from '../RunProgress';
import type { RunStageProps } from './RunStage.type';

const RunStage = ({ sessionId, children }: RunStageProps) => {
  const board = useSessionDashboard(sessionId);
  const live = useLiveRoom(board.session, board.lines);
  const runFailure = useLoggedFailure(board.session?.error, FAILURE.run);
  const { session } = board;
  if (!session) return children(null);

  const { snapshot } = session;
  return children({
    title: snapshot.name,
    chips: (
      <RunChips
        status={session.status}
        job={board.progress}
        place={hostLabel(snapshot.host)}
        lan={snapshot.lan === true}
        count={live.players.length || snapshot.players.length}
        uptime={board.uptime}
      />
    ),
    actions: <RunActions address={board.address} stoppable={canStop(session.status)} onStop={board.stopSession} />,
    codes: runCodes(session),
    config: runConfig(snapshot),
    children: (
      <>
        <RunProgress job={board.progress} />
        {board.error && <ErrorCallout message={board.error} />}
        {runFailure && <ErrorCallout message={runFailure} />}
        <RunPlayers session={session} rows={live.players} />
      </>
    ),
  });
};

export { RunStage };
