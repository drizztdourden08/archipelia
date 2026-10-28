/* @layer renderer-app @kind component */
import { useConnectedCount } from '../../../../hooks/useConnectedCount';
import { LobbyMembers } from '../../../LobbyMembers';
import { PlayersPanel } from '../PlayersPanel';
import type { PlayersPaneProps } from './PlayersPane.type';

const PlayersPane = ({ screen }: PlayersPaneProps) => {
  const { draft, tab } = screen;
  const connected = useConnectedCount(tab);
  const joined = draft.direct ? <LobbyMembers serverId={tab.serverId} lobbyId={tab.lobbyId} /> : undefined;
  return (
    <PlayersPanel
      players={draft.players}
      installed={screen.installed}
      presets={screen.presets}
      selected={screen.selected}
      busy={screen.busy}
      direct={draft.direct !== undefined}
      seats={false}
      connected={joined}
      connectedCount={connected}
      actions={screen.players}
      onEdit={screen.toggleSelected}
    />
  );
};

export { PlayersPane };
