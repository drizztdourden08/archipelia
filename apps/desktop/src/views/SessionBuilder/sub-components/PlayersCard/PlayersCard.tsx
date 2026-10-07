/* @layer renderer-app @kind component */
import { useCallback, useMemo } from 'react';
import type { SessionPlayer } from '@archipelia/model';
import { RowGrid } from '@drizztdourden08/tessera/composites';
import type { MenuItem, RowGridColumn } from '@drizztdourden08/tessera/composites';
import { Card, SectionHeader, Select, Stack, TextInput } from '@drizztdourden08/tessera/primitives';
import type { PlayersCardProps } from './PlayersCard.type';
import { PlayerOverridesCell } from '../PlayerOverridesCell';
import { PlayerSourceCell } from '../PlayerSourceCell';
import { gameOptionsOf } from '../../behavior/game-options-of';
import { playerLabel } from '../../behavior/player-label';
import { NAME_LIMIT, PLAYER_GRID_CLASS } from '../../SessionBuilder.constants';

const slotKey = (player: SessionPlayer) => String(player.slot);

const PlayersCard = ({ players, installed, presets, selectedSlot, busy, actions, onEdit }: PlayersCardProps) => {
  const columns = useMemo((): RowGridColumn<SessionPlayer>[] => [
    {
      id: 'name', label: 'Name', min: 120, max: 220,
      cell: (player) => <TextInput value={player.name} placeholder="Name" maxLength={NAME_LIMIT} onChange={(event) => actions.rename(player.slot, event.target.value)} />,
    },
    {
      id: 'game', label: 'Game', min: 160, max: 280,
      cell: (player) => (
        <Select value={player.game} options={gameOptionsOf(installed, player.game)} placeholder="Pick a game" searchable onChange={(game: string) => actions.setGame(player.slot, game)} />
      ),
    },
    {
      id: 'source', label: 'Preset', min: 160, max: 280,
      cell: (player) => <PlayerSourceCell player={player} presets={presets} busy={busy} onSource={actions.setSource} onImport={actions.importYaml} />,
    },
    {
      id: 'overrides', label: 'Overrides', min: 160, max: 220, fold: true,
      cell: (player) => <PlayerOverridesCell player={player} selected={player.slot === selectedSlot} onEdit={onEdit} />,
    },
  ], [actions, busy, installed, onEdit, presets, selectedSlot]);
  const remove = useCallback((key: string) => actions.remove(Number(key)), [actions]);
  const rowMenu = useCallback((player: SessionPlayer): MenuItem[] => [
    { id: 'duplicate', label: 'Duplicate', icon: 'copy', onSelect: () => actions.duplicate(player.slot) },
  ], [actions]);

  return (
    <Card>
      <Stack gap="sm">
        <SectionHeader title={`Players · ${players.length}`} subtitle="A player picks any installed game, then one of its presets or an imported file." />
        <RowGrid
          label="Players"
          className={PLAYER_GRID_CLASS}
          rows={players}
          columns={columns}
          rowKey={slotKey}
          rowLabel={playerLabel}
          numbered
          onAdd={actions.add}
          addLabel="Add player"
          onRemove={remove}
          rowMenu={rowMenu}
          empty={installed.length ? 'No player yet.' : 'No game installed yet. Add games in Games first.'}
        />
      </Stack>
    </Card>
  );
};

export { PlayersCard };
