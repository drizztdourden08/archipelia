/* @layer core @kind logic */
import type { Lobby } from '@archipelia/model';
import { rejected } from '../state/rejected';
import { seatTaken } from '../state/seat-taken';
import { seatFailure } from './seat-failure';

const claimSeat = (draft: Lobby, wanted: string | undefined): string | undefined => {
  if (wanted === undefined) return undefined;
  const held = (draft.seats ?? []).find((name) => name.toLowerCase() === wanted.toLowerCase());
  if (held === undefined) throw rejected(seatFailure(`This lobby holds no seat named ${wanted}.`));
  if (seatTaken(draft, held)) throw rejected(seatFailure(`The seat ${held} is already taken.`));
  return held;
};

export { claimSeat };
