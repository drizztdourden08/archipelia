/* @layer renderer-app @kind component */
import { EmptyState, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { LOBBY_PLAYERS_TEXT } from './LobbyPlayers.constants';
import type { LobbyPlayersProps } from './LobbyPlayers.type';
import { PendingRow } from '../PendingRow';
import { SeatRow } from '../SeatRow';

const LobbyPlayers = ({ lobby }: LobbyPlayersProps) => (
  <Stack gap="sm" className="session-panel">
    <Text variant="label">{`${LOBBY_PLAYERS_TEXT.seats} (${lobby.seats.length})`}</Text>
    {lobby.seats.length === 0 && <EmptyState message={LOBBY_PLAYERS_TEXT.noSeats} />}
    {lobby.seats.length > 0 && (
      <Stack gap="sm" role="list" aria-label={LOBBY_PLAYERS_TEXT.seats}>
        {lobby.seats.map((seat) => <SeatRow key={seat.key} seat={seat} />)}
      </Stack>
    )}
    {lobby.pending.length > 0 && (
      <Stack gap="sm" role="list" aria-label={LOBBY_PLAYERS_TEXT.pending}>
        <Text variant="label">{`${LOBBY_PLAYERS_TEXT.pending} (${lobby.pending.length})`}</Text>
        {lobby.pending.map((join) => <PendingRow key={join.id} join={join} />)}
      </Stack>
    )}
  </Stack>
);

export { LobbyPlayers };
