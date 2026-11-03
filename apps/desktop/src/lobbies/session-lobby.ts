/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { CLOSED_DOOR } from './lobbies.constants';
import { openSeatCount } from './open-seat-count';

const sessionLobby = ({ name, host, generator, server, direct, players }: SessionTemplate) => {
  const { admission, allowUnlisted, allowedGames } = direct ?? CLOSED_DOOR;
  return {
    name: name.trim() || 'Session',
    openSeats: openSeatCount(players),
    options: {
      admission, allowUnlisted, allowedGames, room: host, generator,
      server: { hintCost: server.hintCost, releaseMode: server.releaseMode, collectMode: server.collectMode, remainingMode: server.remainingMode, autoShutdownMinutes: server.autoShutdownMinutes },
    },
  };
};

export { sessionLobby };
