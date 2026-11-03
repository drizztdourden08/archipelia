/* @layer core @kind types */
import type { HeldSeat, OpenSeats } from '@drizztdourden08/archipelia-lobby-protocol';

type Advertised = { seats?: HeldSeat[]; open?: OpenSeats; allowedGames?: string[] };

export type { Advertised };
