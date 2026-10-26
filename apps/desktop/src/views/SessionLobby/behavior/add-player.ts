/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';
import { nextSlot } from './next-slot';
import { freeName } from './free-name';

const newPlayer = (players: SessionPlayer[], game = '', presetId = ''): SessionPlayer => ({
  slot: nextSlot(players),
  name: freeName(players, 'Player'),
  game,
  source: { kind: 'preset', presetId, overrides: {} },
});

const addPlayer = (players: SessionPlayer[], game = '', presetId = '') => [...players, newPlayer(players, game, presetId)];

export { addPlayer };
