/* @layer renderer-app @kind component */
import { Stack } from '@drizztdourden08/tessera/primitives';
import { sourcesOf } from '../../behavior/player-sources';
import { OverridesPanel } from '../OverridesPanel';
import { PlayersCard } from '../PlayersCard';
import type { PlayersPanelProps } from './PlayersPanel.type';

const PlayersPanel = ({ players, installed, presets, selected, busy, direct, seats, connected, connectedCount, actions, onEdit }: PlayersPanelProps) => {
  const { game, preset } = sourcesOf(selected, installed, presets);
  return (
    <Stack gap="md">
      <PlayersCard
        players={players}
        installed={installed}
        presets={presets}
        selectedSlot={selected?.slot}
        busy={busy}
        direct={direct}
        seats={seats}
        connected={connected}
        connectedCount={connectedCount}
        actions={actions}
        onEdit={onEdit}
      />
      {selected && (
        <OverridesPanel
          player={selected}
          game={game}
          preset={preset}
          onValue={actions.setOverride}
          onReset={actions.resetOverride}
          onResetAll={actions.resetAll}
          onClose={onEdit}
        />
      )}
    </Stack>
  );
};

export { PlayersPanel };
