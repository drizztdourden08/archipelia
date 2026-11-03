/* @layer renderer-app @kind logic */
import type { LobbySeatSide, LobbySeatSideValue } from '@archipelia/design';
import type { SessionPlayer } from '@archipelia/model';
import type { OwnSeat, SeatContext } from '../SessionLobby.type';
import { SLOT_TEXT } from './slot.constants';

const valueOf = (player: SessionPlayer, fresh: boolean): LobbySeatSideValue | undefined => {
  if (fresh) return undefined;
  return player.kind === 'direct' ? 'direct' : 'set';
};

const seatSideOf = ({ slot, player }: OwnSeat, fresh: boolean, { direct, busy, actions }: SeatContext): LobbySeatSide | undefined => {
  if (!direct) return undefined;
  return { label: SLOT_TEXT.sideLabel(slot), value: valueOf(player, fresh), disabled: busy, onChange: (side) => actions.pick(slot, side) };
};

export { seatSideOf };
