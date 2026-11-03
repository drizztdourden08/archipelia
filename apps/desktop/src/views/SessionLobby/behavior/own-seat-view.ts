/* @layer renderer-app @kind logic */
import type { LobbySeatProps } from '@archipelia/design';
import type { OwnSeat, SeatContext } from '../SessionLobby.type';
import { freshSeatView } from './fresh-seat-view';
import { isFreshSeat } from './is-fresh-seat';
import { openSeatView } from './open-seat-view';
import { seatSideOf } from './seat-side-of';
import { seatToolsOf } from './seat-tools-of';
import { setSeatView } from './set-seat-view';

const ownSeatView = (seat: OwnSeat, context: SeatContext): LobbySeatProps => {
  const { player, slot } = seat;
  const fresh = isFreshSeat(player, context.fresh);
  const parts = { side: seatSideOf(seat, fresh, context), tools: seatToolsOf(seat, fresh, context) };
  if (player.kind === 'direct') return openSeatView(seat, parts);
  return fresh ? freshSeatView(slot, parts) : setSeatView(seat, player, context, parts);
};

export { ownSeatView };
