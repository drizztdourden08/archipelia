/* @layer core @kind logic */
import type { ServerEntry } from './server.type';
import type { HostTarget } from './session.type';

const hostLabel = (host: HostTarget, servers: ServerEntry[] = []) => {
  if (host.kind === 'local') return `local :${host.port}`;
  if (host.kind === 'archipelago-gg') return 'archipelago.gg';
  return servers.find((server) => server.id === host.serverId)?.label ?? 'remote server';
};

export { hostLabel };
