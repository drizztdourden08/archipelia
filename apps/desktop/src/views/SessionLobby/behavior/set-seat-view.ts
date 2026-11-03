/* @layer renderer-app @kind logic */
import type { LobbySeatProps } from '@archipelia/design';
import type { SetPlayer } from '@archipelia/model';
import { SEAT_TEXT } from '../SessionLobby.constants';
import type { OwnSeat, SeatContext, SeatParts } from '../SessionLobby.type';
import { gameOf } from './game-of';
import { isAppGame } from './is-app-game';
import { seatMetaOf } from './seat-meta-of';
import { SLOT_STATUS, SLOT_TEXT } from './slot.constants';
import { slotStatusOf } from './slot-status-of';

const setSeatView = (seat: OwnSeat, player: SetPlayer, context: SeatContext, { side, tools }: SeatParts): LobbySeatProps => {
  const { slot, kind } = seat;
  const status = slotStatusOf(player, isAppGame(player, context.installed), context.problemSlots.has(slot));
  const ready = status !== SLOT_STATUS.needsSetup;
  const keep = { id: 'keep', label: SEAT_TEXT.keep, nameSuffix: player.name, icon: 'bookmark' as const, primary: true, disabled: context.busy, onSelect: () => context.actions.keep(slot) };
  return {
    state: 'filled',
    name: player.name.trim() || SLOT_TEXT.unnamed,
    game: gameOf(player),
    meta: seatMetaOf(seat, context.presets, ready),
    status,
    actions: kind === 'added' ? [keep] : [],
    side,
    tools,
    onOpen: () => context.actions.edit(slot),
  };
};

export { setSeatView };
