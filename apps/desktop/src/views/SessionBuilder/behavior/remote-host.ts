/* @layer renderer-app @kind logic */
import type { HostTarget, ServerEntry } from '@archipelia/model';
import { ggTarget } from './gg-target';

const remoteHost = (current: HostTarget, servers: readonly ServerEntry[], ggBaseUrl: string): HostTarget => {
  if (current.kind !== 'local') return current;
  const first = servers[0];
  return first ? { kind: 'remote', serverId: first.id } : ggTarget(ggBaseUrl);
};

export { remoteHost };
