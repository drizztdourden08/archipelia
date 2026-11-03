/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';
import { freeName } from './free-name';
import { renumber } from './renumber';

const duplicatePlayer = (players: SessionPlayer[], slot: number) => {
  const index = players.findIndex((player) => player.slot === slot);
  const source = players[index];
  if (!source) return players;
  const copy: SessionPlayer = source.kind === 'set' ? { ...structuredClone(source), name: freeName(players, source.name) } : { ...source };
  return renumber([...players.slice(0, index + 1), copy, ...players.slice(index + 1)]);
};

export { duplicatePlayer };
