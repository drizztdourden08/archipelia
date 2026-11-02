/* @layer core @kind logic */
import { SEAT_LIMIT, SEAT_NAME_LIMIT } from './options.constants';

const readSeat = (value: unknown, index: number): string => {
  if (typeof value !== 'string' || value === '' || value.length > SEAT_NAME_LIMIT) throw new Error(`seats[${index}] must be text of 1 to ${SEAT_NAME_LIMIT} characters`);
  return value;
};

const readSeats = (value: unknown): string[] | undefined => {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.length > SEAT_LIMIT) throw new Error(`seats must be a list of at most ${SEAT_LIMIT} names`);
  const seats = value.map(readSeat);
  if (new Set(seats.map((seat) => seat.toLowerCase())).size !== seats.length) throw new Error('seats must not repeat a name');
  return seats;
};

export { readSeats };
