/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { Text } from '@drizztdourden08/tessera/primitives';
import { LobbySeatGrid } from '@archipelia/design';
import { LobbyMembers } from '../../../LobbyMembers';
import { emptyPlayers } from '../../behavior/empty-players';
import { seatsOf } from '../../behavior/seats-of';
import { sourcesOf } from '../../behavior/player-sources';
import { useSeatContext } from '../../behavior/useSeatContext';
import { SEAT_TEXT } from '../../SessionLobby.constants';
import { OverridesPanel } from '../OverridesPanel';
import { OwnSeat } from '../OwnSeat';
import { SeatEditor } from '../SeatEditor';
import type { SeatsPaneProps } from './SeatsPane.type';

const SeatsPane = ({ screen, empty }: SeatsPaneProps) => {
  const { draft, installed, lobby, presets, saved, selected, tab } = screen;
  const direct = draft.direct !== undefined;
  const seats = useMemo(() => seatsOf(draft.players, saved.players, lobby?.members ?? []), [draft.players, lobby?.members, saved.players]);
  const context = useSeatContext(screen);
  const { game, preset } = sourcesOf(selected, installed, presets);
  return (
    <>
      <LobbySeatGrid label={SEAT_TEXT.grid} addLabel={SEAT_TEXT.add} addDisabled={screen.busy} onAdd={screen.addPlayer}>
        {seats.map((seat) => <OwnSeat key={seat.key} seat={seat} context={context} />)}
        {direct && <LobbyMembers serverId={tab.serverId} lobbyId={tab.lobbyId} />}
      </LobbySeatGrid>
      {empty && <Text variant="caption" tone="dim">{emptyPlayers(installed.length > 0, direct)}</Text>}
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
    </>
  );
};

export { SeatsPane };
