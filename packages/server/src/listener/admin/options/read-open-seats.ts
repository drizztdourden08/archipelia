/* @layer core @kind logic */
import { SEAT_LIMIT } from './options.constants';
import { readWhole } from './read-whole';

const readOpenSeats = (value: unknown): { openSeats: number } | Record<string, never> =>
  (value === undefined ? {} : { openSeats: readWhole('openSeats', value, { min: 0, max: SEAT_LIMIT }) });

export { readOpenSeats };
