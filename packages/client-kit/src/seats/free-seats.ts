/* @layer client-kit @kind logic */
import type { HeldSeat } from './seats.type';

const freeSeats = (seats: readonly HeldSeat[] | undefined): string[] => (seats ?? []).filter((seat) => seat.free).map((seat) => seat.name);

export { freeSeats };
