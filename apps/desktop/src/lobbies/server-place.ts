/* @layer renderer-app @kind logic */
import type { LobbyServerEntry } from '@archipelia/model';
import { LOCAL_SERVER } from './lobbies.constants';
import type { LobbyServerStatus, ServerPlace } from './lobbies.type';
import { lobbyAddress } from './lobby-address';
import { parseServerUrl } from './parse-server-url';

const remoteAddress = (entry: LobbyServerEntry | undefined): string | null => {
  const target = entry ? parseServerUrl(entry.url) : null;
  return target ? `${target.host}:${target.port}` : null;
};

const serverPlace = (serverId: string, entries: readonly LobbyServerEntry[], status: LobbyServerStatus | null): ServerPlace => {
  if (serverId === LOCAL_SERVER) return { local: true, label: 'This computer', address: lobbyAddress(status), where: 'this computer' };
  const entry = entries.find((candidate) => candidate.id === serverId);
  const label = entry?.label ?? 'A remote server';
  return { local: false, label, address: remoteAddress(entry), where: `the computer of ${label}` };
};

export { serverPlace };
