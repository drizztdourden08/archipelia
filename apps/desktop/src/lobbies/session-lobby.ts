/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import type { DirectOptions } from './lobbies.type';

const sessionLobby = ({ name, host, generator, server }: SessionTemplate, { admission, allowUnlisted }: DirectOptions) => ({
  name: name.trim() || 'Session',
  options: {
    admission, allowUnlisted, room: host, generator,
    server: { hintCost: server.hintCost, releaseMode: server.releaseMode, collectMode: server.collectMode, remainingMode: server.remainingMode, autoShutdownMinutes: server.autoShutdownMinutes },
  },
});

export { sessionLobby };
