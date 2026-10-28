/* @layer renderer-app @kind types */
import type { GamePreset } from '@archipelia/model';
import type { OwnSeat, SeatActions } from '../../SessionLobby.type';

type OwnSeatProps = {
  seat: OwnSeat;
  selected: boolean;
  presets: GamePreset[];
  busy: boolean;
  actions: SeatActions;
};

export type { OwnSeatProps };
