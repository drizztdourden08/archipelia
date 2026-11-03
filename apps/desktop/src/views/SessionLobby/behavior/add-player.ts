/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';
import { nextSlot } from './next-slot';
import { freeName } from './free-name';
import { newSet } from './new-set';

const addPlayer = (players: SessionPlayer[], game = '', presetId = ''): SessionPlayer[] =>
  [...players, newSet(nextSlot(players), freeName(players, 'Player'), game, presetId)];

export { addPlayer };
