/* @layer renderer-app @kind types */
import type { LobbySeatAction } from '../../LobbySeat.type';

type SeatButtonsProps = { actions: readonly LobbySeatAction[]; iconOnly?: boolean; className?: string };

export type { SeatButtonsProps };
