/* @layer core @kind logic */
import type { Failure, SlotEntry } from '@drizztdourden08/archipelia-lobby-protocol';

const checkGames = (allowed: readonly string[] | undefined, slots: readonly SlotEntry[]): Failure | null => {
  if (!allowed || allowed.length === 0) return null;
  const listed = new Set(allowed.map((game) => game.toLowerCase()));
  const index = slots.findIndex((slot) => !listed.has(slot.game.toLowerCase()));
  const refused = slots[index];
  if (!refused) return null;
  return { code: 'game-not-allowed', message: `This lobby does not take ${refused.game}. It takes ${allowed.join(', ')}.`, field: `slots[${index}].game`, slot: refused.name };
};

export { checkGames };
