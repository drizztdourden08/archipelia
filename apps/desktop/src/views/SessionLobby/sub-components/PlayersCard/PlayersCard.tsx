/* @layer renderer-app @kind component */
import { useCallback, useMemo } from 'react';
import type { SessionPlayer } from '@archipelia/model';
import { RowGrid } from '@drizztdourden08/tessera/composites';
import type { MenuItem, RowGridColumn } from '@drizztdourden08/tessera/composites';
import { Card, SectionHeader, Stack, TextInput } from '@drizztdourden08/tessera/primitives';
import type { PlayersCardProps } from './PlayersCard.type';
import { DirectCell } from '../DirectCell';
import { GameCell } from '../GameCell';
import { PlayerOverridesCell } from '../PlayerOverridesCell';
import { PlayerSourceCell } from '../PlayerSourceCell';
import { JoinedTag } from '../JoinedTag';
import { playerLabel } from '../../behavior/player-label';
import { emptyPlayers } from '../../behavior/empty-players';
import { NAME_LIMIT, PLAYER_GRID_CLASS } from '../../SessionLobby.constants';
import { subtitleOf } from '../../behavior/subtitle-of';

const slotKey = (player: SessionPlayer) => String(player.slot);

const PlayersCard = ({ players, installed, presets, selectedSlot, busy, direct, seats, connected, connectedCount, actions, onEdit }: PlayersCardProps) => {
  const columns = useMemo((): RowGridColumn<SessionPlayer>[] => [
    {
      id: 'name', label: 'Name', min: 120, max: 220,
      cell: (player) => <TextInput value={player.name} placeholder="Name" maxLength={NAME_LIMIT} onChange={(event) => actions.rename(player.slot, event.target.value)} />,
    },
    {
      id: 'game', label: 'Game', min: 160, max: 280,
      cell: (player) => <GameCell player={player} installed={installed} onGame={actions.setGame} />,
    },
    {
      id: 'source', label: 'Preset', min: 160, max: 280,
      cell: (player) => <PlayerSourceCell player={player} presets={presets} busy={busy} onSource={actions.setSource} onImport={actions.importYaml} />,
    },
    {
      id: 'overrides', label: 'Overrides', min: 160, max: 220, fold: true,
      cell: (player) => <PlayerOverridesCell player={player} selected={player.slot === selectedSlot} onEdit={onEdit} />,
    },
    ...(seats ? [{ id: 'direct', label: 'Direct', min: 90, max: 110, cell: (player: SessionPlayer) => <DirectCell player={player} onChange={actions.setDirect} /> }] : []),
    ...(direct && !seats ? [{ id: 'joined', label: 'Joined', min: 120, max: 160, fold: true, cell: () => <JoinedTag /> }] : []),
  ], [actions, busy, direct, installed, onEdit, presets, seats, selectedSlot]);
  const remove = useCallback((key: string) => actions.remove(Number(key)), [actions]);
  const rowMenu = useCallback((player: SessionPlayer): MenuItem[] => [
    { id: 'duplicate', label: 'Duplicate', icon: 'copy', onSelect: () => actions.duplicate(player.slot) },
  ], [actions]);

  return (
    <Card>
      <Stack gap="sm">
        <SectionHeader title={`Players · ${players.length + connectedCount}`} subtitle={subtitleOf(direct, seats)} />
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
          empty={emptyPlayers(installed.length > 0, direct)}
        />
        {connected}
      </Stack>
    </Card>
  );
};

export { PlayersCard };
