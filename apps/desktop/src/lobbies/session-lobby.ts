/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { CLOSED_DOOR } from './lobbies.constants';

const sessionLobby = ({ name, host, generator, server, direct }: SessionTemplate) => {
  const { admission, allowUnlisted } = direct ?? CLOSED_DOOR;
  return {
    name: name.trim() || 'Session',
    options: {
      admission, allowUnlisted, room: host, generator,
      server: { hintCost: server.hintCost, releaseMode: server.releaseMode, collectMode: server.collectMode, remainingMode: server.remainingMode, autoShutdownMinutes: server.autoShutdownMinutes },
    },
  };
};

export { sessionLobby };
