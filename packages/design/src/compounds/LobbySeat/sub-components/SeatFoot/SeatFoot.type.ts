/* @layer renderer-app @kind types */
import type { LobbySeatAction, LobbySeatSide, LobbySeatStatus } from '../../LobbySeat.type';

type SeatFootProps = { side?: LobbySeatSide; status?: LobbySeatStatus; actions: readonly LobbySeatAction[] };

export type { SeatFootProps };
