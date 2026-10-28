/* @layer renderer-app @kind component */
import { Stack } from '@drizztdourden08/tessera/primitives';
import { useConnectedCount } from '../../../../hooks/useConnectedCount';
import { LobbyMembers } from '../../../LobbyMembers';
import { sourcesOf } from '../../behavior/player-sources';
import { OverridesPanel } from '../OverridesPanel';
import { PlayersCard } from '../PlayersCard';
import type { PlayersPaneProps } from './PlayersPane.type';

const PlayersPane = ({ screen }: PlayersPaneProps) => {
  const { draft, selected, players, tab, toggleSelected } = screen;
  const { game, preset } = sourcesOf(selected, screen.installed, screen.presets);
  const connected = useConnectedCount(tab);
  const joined = draft.direct ? <LobbyMembers serverId={tab.serverId} lobbyId={tab.lobbyId} /> : undefined;
  return (
    <Stack gap="md">
      <PlayersCard
        players={draft.players}
        installed={screen.installed}
        presets={screen.presets}
        selectedSlot={selected?.slot}
        busy={screen.busy}
        direct={draft.direct !== undefined}
        connected={joined}
        connectedCount={connected}
        actions={players}
        onEdit={toggleSelected}
      />
      {selected && (
        <OverridesPanel
          player={selected}
          game={game}
          preset={preset}
          onValue={players.setOverride}
          onReset={players.resetOverride}
          onResetAll={players.resetAll}
          onClose={toggleSelected}
        />
      )}
    </Stack>
  );
};

export { PlayersPane };
