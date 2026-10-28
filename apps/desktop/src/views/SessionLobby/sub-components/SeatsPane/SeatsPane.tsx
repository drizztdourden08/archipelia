/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { SeatCard, SeatGrid } from '@drizztdourden08/tessera/composites';
import { Box, SectionHeader, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { useConnectedCount } from '../../../../hooks/useConnectedCount';
import { LobbyMembers } from '../../../LobbyMembers';
import { emptyPlayers } from '../../behavior/empty-players';
import { seatsOf } from '../../behavior/seats-of';
import { sourcesOf } from '../../behavior/player-sources';
import { SEAT_TEXT } from '../../SessionLobby.constants';
import { OverridesPanel } from '../OverridesPanel';
import { OwnSeat } from '../OwnSeat';
import { SeatArt } from '../SeatArt';
import { SeatEditor } from '../SeatEditor';
import type { SeatsPaneProps } from './SeatsPane.type';

const joinedLead = (game: string | undefined) => <SeatArt game={game} />;

const SeatsPane = ({ screen }: SeatsPaneProps) => {
  const { draft, installed, lobby, presets, saved, selected, tab } = screen;
  const connected = useConnectedCount(tab);
  const direct = draft.direct !== undefined;
  const seats = useMemo(() => seatsOf(draft.players, saved.players, lobby?.members ?? []), [draft.players, lobby?.members, saved.players]);
  const actions = { edit: screen.toggleSelected, remove: screen.removePlayer, duplicate: screen.duplicatePlayer, keep: (slot: number) => void screen.keep(slot) };
  const { game, preset } = sourcesOf(selected, installed, presets);
  return (
    <Stack gap="md">
      <Box as="section" aria-label={SEAT_TEXT.heading}>
        <Stack gap="sm">
          <SectionHeader title={`${SEAT_TEXT.heading} · ${draft.players.length + connected}`} subtitle={SEAT_TEXT.hint} />
          <SeatGrid label={SEAT_TEXT.grid}>
            {seats.map((seat) => (
              <OwnSeat key={seat.key} seat={seat} selected={selected?.slot === seat.slot} presets={presets} busy={screen.busy} actions={actions} />
            ))}
            {direct && <LobbyMembers serverId={tab.serverId} lobbyId={tab.lobbyId} lead={joinedLead} />}
            <SeatCard state="add" label={SEAT_TEXT.add} disabled={screen.busy} onSelect={screen.addPlayer} />
          </SeatGrid>
          {seats.length === 0 && connected === 0 && <Text variant="caption" tone="dim">{emptyPlayers(installed.length > 0, direct)}</Text>}
        </Stack>
      </Box>
      {selected && (
        <SeatEditor
          player={selected}
          installed={installed}
          presets={presets}
          busy={screen.busy}
          overridesOpen={screen.overridesOpen}
          actions={screen.players}
          onOverrides={screen.toggleSeatOverrides}
          onClose={screen.closeEditor}
        />
      )}
      {selected && screen.overridesOpen && (
        <OverridesPanel
          player={selected}
          game={game}
          preset={preset}
          onValue={screen.players.setOverride}
          onReset={screen.players.resetOverride}
          onResetAll={screen.players.resetAll}
          onClose={screen.toggleSeatOverrides}
        />
      )}
    </Stack>
  );
};

export { SeatsPane };
