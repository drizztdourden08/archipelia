/* @layer core @kind logic */
import type { HostedPlayer } from '@archipelia/model';
import type { PlayerDeps } from './write-players.type';
import { renderPlayer } from './render-player';
import { playerFileName } from './player-file-name';

const writePlayers = async (players: HostedPlayer[], playersDir: string, deps: PlayerDeps) => {
  const names = new Set<string>();
  for (const player of players) {
    if (names.has(player.name)) throw new Error(`two players are named ${player.name}`);
    names.add(player.name);
    await deps.files.writeText(`${playersDir}/${playerFileName(player)}`, await renderPlayer(player, deps));
  }
};

export { writePlayers };
