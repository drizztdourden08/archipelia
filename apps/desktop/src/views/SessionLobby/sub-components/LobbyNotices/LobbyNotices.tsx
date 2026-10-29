/* @layer renderer-app @kind component */
import { Callout } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { SESSION_FAILED } from '../../../../hooks/lobby-hooks.constants';
import { LOBBY_SCREEN } from '../../SessionLobby.constants';
import { useLobbyNotices } from '../../behavior/useLobbyNotices';
import { ProblemList } from '../ProblemList';
import type { LobbyNoticesProps } from './LobbyNotices.type';

const LobbyNotices = ({ screen }: LobbyNoticesProps) => {
  const notices = useLobbyNotices(screen.tab);
  const failure = screen.lobby?.failure;
  return (
    <>
      {screen.dataFailed && <ErrorCallout message={SESSION_FAILED.data} onRetry={screen.reloadData} />}
      {screen.error && <ErrorCallout message={screen.error} />}
      {notices.map((notice) => <Callout key={notice} tone="warning">{notice}</Callout>)}
      {failure && <Callout tone="danger">{`${LOBBY_SCREEN.failed} ${failure.message}`}</Callout>}
      <ProblemList problems={screen.problems} attempted={screen.runAttempted} onShow={screen.showProblem} />
    </>
  );
};

export { LobbyNotices };
