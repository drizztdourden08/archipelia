/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';
import { SLOTS_TEXT } from '../SessionBuilder.constants';

const slotsSummary = (players: readonly SessionPlayer[]): string => {
  if (players.length === 0) return SLOTS_TEXT.none;
  const open = players.filter((player) => player.kind === 'direct').length;
  return `${players.length} ${players.length === 1 ? 'slot' : 'slots'}, ${open} open`;
};

export { slotsSummary };
