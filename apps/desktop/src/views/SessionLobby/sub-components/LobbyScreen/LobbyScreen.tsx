/* @layer renderer-app @kind component */
import { Box, Callout, Grid, Stack } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { openSessionEditor } from '../../../../hooks/open-session-editor';
import { SESSION_FAILED } from '../../../../hooks/lobby-hooks.constants';
import { SessionDashboard } from '../../../SessionDashboard';
import type { LobbyScreenProps } from '../../SessionLobby.type';
import { LOBBY_COLUMN_MIN, LOBBY_SCREEN } from '../../SessionLobby.constants';
import { useLobbyScreen } from '../../behavior/useLobbyScreen';
import { ConnectionCard } from '../ConnectionCard';
import { LobbyHeader } from '../LobbyHeader';
import { PlayersPane } from '../PlayersPane';
import { ProblemList } from '../ProblemList';

const LobbyScreen = ({ initial }: LobbyScreenProps) => {
  const screen = useLobbyScreen(initial);
  const { draft, run } = screen;
  return (
    <Box ref={screen.rootRef}>
      <Stack>
        <LobbyHeader
          name={draft.name}
          phase={screen.lobby?.phase}
          direct={draft.direct !== undefined}
          saved={screen.saved}
          busy={screen.busy}
          action={screen.action}
          onSave={() => void screen.save()}
          onEdit={() => openSessionEditor(draft.id)}
          onClose={() => void screen.close()}
        />
        {screen.dataFailed && <ErrorCallout message={SESSION_FAILED.data} onRetry={screen.reloadData} />}
        {screen.error && <ErrorCallout message={screen.error} />}
        {!draft.lobby?.lobbyId && <Callout tone="info">{LOBBY_SCREEN.notStarted}</Callout>}
        <ProblemList problems={screen.problems} attempted={screen.runAttempted} onShow={screen.showProblem} />
        {run ? <SessionDashboard sessionId={run.id} /> : (
          <Grid minColWidth={LOBBY_COLUMN_MIN} fit gap="md">
            <PlayersPane screen={screen} />
            <ConnectionCard template={draft} />
          </Grid>
        )}
      </Stack>
    </Box>
  );
};

export { LobbyScreen };
