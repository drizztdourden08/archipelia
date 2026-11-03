/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { Text } from '@drizztdourden08/tessera/primitives';
import { LobbySeatGrid } from '@archipelia/design';
import { LobbyMembers } from '../../../LobbyMembers';
import { emptyPlayers } from '../../behavior/empty-players';
import { seatsOf } from '../../behavior/seats-of';
import { useSeatContext } from '../../behavior/useSeatContext';
import { SEAT_TEXT } from '../../SessionLobby.constants';
import { OwnSeat } from '../OwnSeat';
import { SlotDialog } from '../SlotDialog';
import type { SeatsPaneProps } from './SeatsPane.type';

const SeatsPane = ({ screen, empty }: SeatsPaneProps) => {
  const { draft, installed, lobby, presets, saved, selected, tab } = screen;
  const direct = draft.direct !== undefined;
  const seats = useMemo(() => seatsOf(draft.players, saved.players, lobby?.members ?? []), [draft.players, lobby?.members, saved.players]);
  const { context, add } = useSeatContext(screen);
  return (
    <>
      <LobbySeatGrid label={SEAT_TEXT.grid} addLabel={SEAT_TEXT.add} addDisabled={screen.busy} onAdd={add}>
        {seats.map((seat) => <OwnSeat key={seat.key} seat={seat} context={context} />)}
        {direct && <LobbyMembers serverId={tab.serverId} lobbyId={tab.lobbyId} />}
      </LobbySeatGrid>
      {empty && <Text variant="caption" tone="dim">{emptyPlayers(installed.length > 0, direct)}</Text>}
      {selected?.kind === 'set' && (
        <SlotDialog
          key={selected.slot}
          player={selected}
          installed={installed}
          presets={presets}
          allowed={draft.direct?.allowedGames ?? []}
          busy={screen.busy}
          actions={screen.players}
          onClose={screen.closeEditor}
        />
      )}
    </>
  );
};

export { SeatsPane };
