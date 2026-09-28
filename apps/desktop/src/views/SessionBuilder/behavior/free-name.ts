/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';
import { NAME_LIMIT } from '../SessionBuilder.constants';

const isTaken = (players: SessionPlayer[], name: string) =>
  players.some((player) => player.name.toLowerCase() === name.toLowerCase());

const freeName = (players: SessionPlayer[], base: string) => {
  const stem = base.replace(/\d+$/, '').slice(0, NAME_LIMIT - 2) || 'Player';
  for (let n = 1; ; n += 1) {
    const name = `${stem}${n}`;
    if (!isTaken(players, name)) return name;
  }
};

export { freeName };
