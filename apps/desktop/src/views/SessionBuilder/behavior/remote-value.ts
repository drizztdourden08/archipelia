/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { LOCAL_SERVER } from '../../../lobbies/lobbies.constants';
import { lobbyServerOf } from '../../../lobbies/lobby-server-of';
import { GG_VALUE, LOBBY_PREFIX, SSH_PREFIX } from './place.constants';

const remoteValue = (template: SessionTemplate): string => {
  const serverId = lobbyServerOf(template);
  if (serverId !== LOCAL_SERVER) return `${LOBBY_PREFIX}${serverId}`;
  if (template.host.kind === 'remote') return `${SSH_PREFIX}${template.host.serverId}`;
  return GG_VALUE;
};

export { remoteValue };
