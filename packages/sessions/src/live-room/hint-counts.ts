/* @layer core @kind logic */
import type { HintView } from './live-room.type';

const hintCounts = (rows: readonly HintView[]) => {
  const found = rows.filter((row) => row.state === 'found').length;
  return { open: rows.length - found, found };
};

export { hintCounts };
