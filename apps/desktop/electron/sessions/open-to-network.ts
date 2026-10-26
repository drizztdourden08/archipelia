/* @layer electron-main @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { LOCAL_SERVER } from '../../src/lobbies/lobbies.constants';
import { lobbyServerOf } from '../../src/lobbies/lobby-server-of';
import type { NetworkSwitch } from './sessions.type';

const openToNetwork = (server: NetworkSwitch) => async (template: SessionTemplate): Promise<void> => {
  if (!template.lan || lobbyServerOf(template) !== LOCAL_SERVER) return;
  const { options } = server.status();
  if (options.mode === 'off') await server.apply({ ...options, mode: 'lan' });
};

export { openToNetwork };
