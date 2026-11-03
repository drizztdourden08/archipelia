/* @layer renderer-app @kind component */
import { useId } from 'react';
import { formatLobbyCode } from '@drizztdourden08/archipelia-lobby-protocol';
import { Text } from '@drizztdourden08/tessera/primitives';
import { configFacts, stageGames } from '../../stage';
import { openSessionEditor } from '../../hooks/open-session-editor';
import { useConnectedCount } from '../../hooks/useConnectedCount';
import { LOBBY_SCREEN } from './SessionLobby.constants';
import type { SessionLobbyProps } from './SessionLobby.type';
import { useLobbyScreen } from './behavior/useLobbyScreen';
import { LobbyNotices } from './sub-components/LobbyNotices';
import { SeatsPane } from './sub-components/SeatsPane';
import { StageActions } from './sub-components/StageActions';
import { StageChips } from './sub-components/StageChips';
import './SessionLobby.css';

const SessionLobby = ({ tab, saved, children }: SessionLobbyProps) => {
  const screen = useLobbyScreen({ tab, saved });
  const connected = useConnectedCount(tab);
  const reasonId = useId();
  const { action, draft, lobby } = screen;
  const direct = draft.direct !== undefined;
  const codes = lobby ? [{ label: LOBBY_SCREEN.code, value: formatLobbyCode(lobby.code) ?? lobby.code, copyLabel: LOBBY_SCREEN.codeCopy }] : [];
  const problems = screen.runAttempted ? screen.problems.length : 0;
  return children({
    title: draft.name,
    chips: <StageChips lobby={lobby} serverId={tab.serverId} direct={direct} changes={screen.changes} count={draft.players.length + connected} problems={problems} />,
    actions: <StageActions live={lobby !== undefined && lobby.phase !== 'closed'} busy={screen.busy} action={action} reasonId={reasonId} onClose={() => void screen.close()} />,
    codes,
    note: action.reason && <Text id={reasonId} variant="caption" tone="dim">{action.reason}</Text>,
    config: { label: LOBBY_SCREEN.config, facts: configFacts(draft), games: stageGames(draft.direct), editLabel: LOBBY_SCREEN.configEdit, onEdit: () => openSessionEditor(saved.id) },
    children: (
      <>
        <LobbyNotices screen={screen} />
        <SeatsPane screen={screen} empty={draft.players.length + connected === 0} />
      </>
    ),
  });
};

export { SessionLobby };
