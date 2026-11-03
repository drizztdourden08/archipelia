/* @layer client-kit @kind logic */
import type { HeldSeat, SeatPick } from './seats.type';

const pickSeat = (seats: readonly HeldSeat[] | undefined, wanted: string): SeatPick => {
  const held = (seats ?? []).find((seat) => seat.name.toLowerCase() === wanted.trim().toLowerCase());
  if (!held) return { ok: false, reason: 'unknown', message: `This lobby holds no seat named ${wanted.trim()}.` };
  if (!held.free) return { ok: false, reason: 'taken', message: `The seat ${held.name} is already taken.` };
  return { ok: true, seat: held.name };
};

export { pickSeat };
