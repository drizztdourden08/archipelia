/* @layer renderer-app @kind logic */
import type { HostTarget, ServerEntry } from '@archipelia/model';
import { ggTarget } from './gg-target';
import type { HostingDefaults } from '../SessionBuilder.type';
import { DEFAULT_PORT } from '../SessionBuilder.constants';

const hostOfKind = (kind: HostTarget['kind'], current: HostTarget, servers: ServerEntry[], hosting?: HostingDefaults): HostTarget => {
  if (kind === current.kind) return current;
  if (kind === 'local') return { kind, port: hosting?.localPort ?? DEFAULT_PORT };
  if (kind === 'remote') return { kind, serverId: servers[0]?.id ?? '' };
  return ggTarget(hosting?.ggBaseUrl ?? '');
};

export { hostOfKind };
