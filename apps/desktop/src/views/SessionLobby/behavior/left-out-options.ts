/* @layer renderer-app @kind logic */
import type { ConfirmActionOptions } from '@drizztdourden08/brock-react';
import type { SeatLeftOut } from '../../../lobbies/lobbies.type';
import { LEFT_OUT_TEXT } from '../SessionLobby.constants';

const leftOutOptions = (seats: readonly SeatLeftOut[]): ConfirmActionOptions => ({
  ...LEFT_OUT_TEXT,
  facts: seats.map(({ player, seat, reason }) => ({ label: `${seat} (${player})`, value: reason })),
});

export { leftOutOptions };
