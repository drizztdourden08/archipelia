/* @layer renderer-app @kind logic */
import { LOCAL_SERVER } from '../../../lobbies/lobbies.constants';
import type { LobbyServerStatus } from '../../../lobbies/lobbies.type';
import type { HostWhere } from '../HostChoice.type';

const chooseWhere = (serverId: string, wantsRemote: boolean, status: LobbyServerStatus | null): HostWhere => {
  if (serverId !== LOCAL_SERVER || wantsRemote) return 'remote';
  return status && status.options.mode !== 'off' ? 'lan' : 'private';
};

export { chooseWhere };
