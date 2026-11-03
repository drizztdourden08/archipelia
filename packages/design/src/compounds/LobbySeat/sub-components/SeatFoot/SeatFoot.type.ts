/* @layer renderer-app @kind types */
import type { LobbySeatAction, LobbySeatStatus } from '../../LobbySeat.type';

type SeatFootProps = { status?: LobbySeatStatus; actions: readonly LobbySeatAction[] };

export type { SeatFootProps };
