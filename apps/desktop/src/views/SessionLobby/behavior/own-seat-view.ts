/* @layer renderer-app @kind logic */
import type { LobbySeatProps } from '@archipelia/design';
import { SEAT_STATUS, SEAT_TEXT } from '../SessionLobby.constants';
import type { OwnSeat, SeatContext } from '../SessionLobby.type';
import { gameOf } from './game-of';
import { playerLabel } from './player-label';
import { seatMetaOf } from './seat-meta-of';
import { seatToolsOf } from './seat-tools-of';

const ownSeatView = (seat: OwnSeat, context: SeatContext): LobbySeatProps => {
  const { player, slot, kind } = seat;
  const name = playerLabel(player);
  const tools = seatToolsOf(seat, name, context);
  if (kind === 'held') return { state: 'held', name: `${SEAT_TEXT.slot} ${slot}`, meta: [`${SEAT_TEXT.waitingFor} ${name} ${SEAT_TEXT.toConnect}`], tools };
  const keep = { id: 'keep', label: SEAT_TEXT.keep, nameSuffix: name, icon: 'bookmark' as const, primary: true, disabled: context.busy, onSelect: () => context.actions.keep(slot) };
  return {
    state: 'filled',
    name,
    game: gameOf(player),
    meta: seatMetaOf(seat, context.presets),
    status: context.problemSlots.has(slot) ? SEAT_STATUS.needsFix : SEAT_STATUS.ready,
    actions: kind === 'added' ? [keep] : [],
    tools,
    selected: context.selectedSlot === slot,
    onOpen: () => context.actions.edit(slot),
  };
};

export { ownSeatView };
