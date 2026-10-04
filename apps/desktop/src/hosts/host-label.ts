/* @layer renderer-app @kind logic */
import type { HostTarget, ServerEntry } from '@archipelia/model';

const hostLabel = (host: HostTarget, servers: ServerEntry[] = []) => {
  if (host.kind === 'local') return `local :${host.port}`;
  if (host.kind === 'archipelago-gg') return 'archipelago.gg';
  return servers.find((server) => server.id === host.serverId)?.label ?? 'remote server';
};

export { hostLabel };
