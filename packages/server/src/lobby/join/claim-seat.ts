/* @layer core @kind logic */
import type { Lobby } from '@archipelia/model';
import { openSeatsOf } from '../state/open-seats-of';
import { rejected } from '../state/rejected';
import { seatTaken } from '../state/seat-taken';
import type { SeatClaim } from './claim-seat.type';
import { seatFailure } from './seat-failure';

const openClaim = (draft: Lobby): SeatClaim => ((openSeatsOf(draft)?.free ?? 0) > 0 ? { openSeat: true } : {});

const namedClaim = (draft: Lobby, wanted: string): SeatClaim => {
  const named = draft.seats ?? [];
  const held = named.find((name) => name.toLowerCase() === wanted.toLowerCase());
  if (held === undefined && named.length === 0 && openSeatsOf(draft)) return openClaim(draft);
  if (held === undefined) throw rejected(seatFailure(`This lobby holds no seat named ${wanted}.`));
  if (seatTaken(draft, held)) throw rejected(seatFailure(`The seat ${held} is already taken.`));
  return { seat: held };
};

const claimSeat = (draft: Lobby, wanted: string | undefined): SeatClaim => (wanted === undefined ? openClaim(draft) : namedClaim(draft, wanted));

export { claimSeat };
