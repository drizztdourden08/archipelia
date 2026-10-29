/* @layer renderer-app @kind component */
import { useId } from 'react';
import { formatLobbyCode } from '@drizztdourden08/archipelia-lobby-protocol';
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { LobbyStage } from '@archipelia/design';
import { openSessionEditor } from '../../../../hooks/open-session-editor';
import { useConnectedCount } from '../../../../hooks/useConnectedCount';
import type { LobbyScreenProps } from '../../SessionLobby.type';
import { LOBBY_SCREEN } from '../../SessionLobby.constants';
import { configFacts } from '../../behavior/config-facts';
import { useLobbyScreen } from '../../behavior/useLobbyScreen';
import { LobbyNotices } from '../LobbyNotices';
import { SeatsPane } from '../SeatsPane';
import { StageActions } from '../StageActions';
import { StageChips } from '../StageChips';

const LobbyScreen = (props: LobbyScreenProps) => {
  const screen = useLobbyScreen(props);
  const connected = useConnectedCount(props.tab);
  const reasonId = useId();
  const { action, draft, lobby, saved, tab } = screen;
  const direct = draft.direct !== undefined;
  const code = lobby ? { label: LOBBY_SCREEN.code, value: formatLobbyCode(lobby.code) ?? lobby.code, copyLabel: LOBBY_SCREEN.codeCopy } : undefined;
  return (
    <Box ref={screen.rootRef} className="session-lobby">
      <LobbyStage
        title={draft.name}
        chips={<StageChips lobby={lobby} serverId={tab.serverId} direct={direct} changes={screen.changes} count={draft.players.length + connected} />}
        actions={<StageActions live={lobby !== undefined && lobby.phase !== 'closed'} busy={screen.busy} action={action} reasonId={reasonId} onClose={() => void screen.close()} />}
        code={code}
        note={action.reason && <Text id={reasonId} variant="caption" tone="dim">{action.reason}</Text>}
        config={{ label: LOBBY_SCREEN.config, facts: configFacts(draft), editLabel: LOBBY_SCREEN.configEdit, onEdit: () => openSessionEditor(saved.id) }}
      >
        <LobbyNotices screen={screen} />
        <SeatsPane screen={screen} empty={draft.players.length + connected === 0} />
      </LobbyStage>
    </Box>
  );
};

export { LobbyScreen };
