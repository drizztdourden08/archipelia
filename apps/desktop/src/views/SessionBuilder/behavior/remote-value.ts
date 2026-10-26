/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { GG_VALUE, LOBBY_PREFIX, SSH_PREFIX } from './place.constants';

const remoteValue = ({ host, direct }: SessionTemplate): string => {
  if (direct) return `${LOBBY_PREFIX}${direct.serverId}`;
  if (host.kind === 'remote') return `${SSH_PREFIX}${host.serverId}`;
  return GG_VALUE;
};

export { remoteValue };
