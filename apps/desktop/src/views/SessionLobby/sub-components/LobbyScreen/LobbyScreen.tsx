/* @layer renderer-app @kind component */
import { Box, Callout, Stack } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { SESSION_FAILED } from '../../../../hooks/lobby-hooks.constants';
import { openSessionEditor } from '../../../../hooks/open-session-editor';
import type { LobbyScreenProps } from '../../SessionLobby.type';
import { useLobbyNotices } from '../../behavior/useLobbyNotices';
import { useLobbyScreen } from '../../behavior/useLobbyScreen';
import { LobbyHeader } from '../LobbyHeader';
import { PlayersPane } from '../PlayersPane';
import { ProblemList } from '../ProblemList';

const LobbyScreen = (props: LobbyScreenProps) => {
  const screen = useLobbyScreen(props);
  const notices = useLobbyNotices(props.tab);
  const { draft, saved, tab } = screen;
  return (
    <Box ref={screen.rootRef}>
      <Stack>
        <LobbyHeader
          name={draft.name}
          lobby={screen.lobby}
          serverId={tab.serverId}
          direct={draft.direct !== undefined}
          changes={screen.changes}
          busy={screen.busy}
          action={screen.action}
          onEdit={() => openSessionEditor(saved.id)}
          onClose={() => void screen.close()}
        />
        {screen.dataFailed && <ErrorCallout message={SESSION_FAILED.data} onRetry={screen.reloadData} />}
        {screen.error && <ErrorCallout message={screen.error} />}
        {notices.map((notice) => <Callout key={notice} tone="warning">{notice}</Callout>)}
        {screen.lobby?.failure && <Callout tone="danger">{`The last run failed: ${screen.lobby.failure.message}`}</Callout>}
        <ProblemList problems={screen.problems} attempted={screen.runAttempted} onShow={screen.showProblem} />
        <PlayersPane screen={screen} />
      </Stack>
    </Box>
  );
};

export { LobbyScreen };
