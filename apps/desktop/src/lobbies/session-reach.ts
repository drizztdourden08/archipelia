/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { LOCAL_SERVER } from './lobbies.constants';
import type { SessionReach } from './lobbies.type';
import { lobbyServerOf } from './lobby-server-of';

const sessionReach = (template: Pick<SessionTemplate, 'host' | 'lan' | 'lobby'>): SessionReach => {
  if (lobbyServerOf(template) !== LOCAL_SERVER) return 'archipelia';
  if (template.host.kind === 'archipelago-gg') return 'gg';
  if (template.host.kind === 'remote') return 'ssh';
  return template.lan ? 'lan' : 'local';
};

export { sessionReach };
