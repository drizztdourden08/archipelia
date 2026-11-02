/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { heldSeatNames } from './held-seat-names';
import { CLOSED_DOOR } from './lobbies.constants';

const sessionLobby = ({ name, host, generator, server, direct, players }: SessionTemplate) => {
  const { admission, allowUnlisted } = direct ?? CLOSED_DOOR;
  return {
    name: name.trim() || 'Session',
    seats: heldSeatNames(players),
    options: {
      admission, allowUnlisted, room: host, generator,
      server: { hintCost: server.hintCost, releaseMode: server.releaseMode, collectMode: server.collectMode, remainingMode: server.remainingMode, autoShutdownMinutes: server.autoShutdownMinutes },
    },
  };
};

export { sessionLobby };
