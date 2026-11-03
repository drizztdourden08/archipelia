/* @layer renderer-app @kind logic */
import { HASH_STEP, SEAT_TINTS } from '../LobbySeat.constants';
import type { SeatTint } from '../LobbySeat.type';

const tintOf = (label: string): SeatTint => {
  const hash = [...label.toLowerCase()].reduce((sum, char) => (sum * HASH_STEP + (char.codePointAt(0) ?? 0)) % SEAT_TINTS.length, 0);
  return SEAT_TINTS[hash] ?? SEAT_TINTS[0];
};

export { tintOf };
