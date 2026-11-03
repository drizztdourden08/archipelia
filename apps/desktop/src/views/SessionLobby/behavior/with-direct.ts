/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';
import { heldOf } from './held-of';
import { newSet } from './new-set';

const withDirect = (player: SessionPlayer, on: boolean, name: string): SessionPlayer => {
  if (on) return heldOf(player);
  return player.kind === 'set' ? player : newSet(player.slot, name, '', '');
};

export { withDirect };
