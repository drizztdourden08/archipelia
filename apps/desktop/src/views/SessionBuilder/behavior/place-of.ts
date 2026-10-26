/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import type { NetworkMode } from '@archipelia/server/network';
import { LOCAL_SERVER } from '../../../lobbies/lobbies.constants';
import type { SessionPlace } from '../SessionBuilder.type';

const placeOf = ({ host, direct }: SessionTemplate, mode: NetworkMode | undefined): SessionPlace => {
  if (!direct) return host.kind === 'local' ? 'local' : 'remote';
  if (direct.serverId !== LOCAL_SERVER) return 'remote';
  return mode && mode !== 'off' ? 'lan' : 'local';
};

export { placeOf };
