/* @layer core @kind logic */
import { FLAG_PROGRESSION, FLAG_TRAP, FLAG_USEFUL } from './spoiler.constants';
import type { ItemClass } from './spoiler.type';

const classOfFlags = (flags: number): ItemClass => {
  if (flags & FLAG_PROGRESSION) return 'progression';
  if (flags & FLAG_TRAP) return 'trap';
  if (flags & FLAG_USEFUL) return 'useful';
  return 'filler';
};

export { classOfFlags };
