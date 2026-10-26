/* @layer renderer-app @kind logic */
import type { HostTarget } from '@archipelia/model';
import { ggTarget } from './gg-target';
import { SSH_PREFIX } from './place.constants';

const hostOfValue = (value: string, ggBaseUrl: string): HostTarget =>
  (value.startsWith(SSH_PREFIX) ? { kind: 'remote', serverId: value.slice(SSH_PREFIX.length) } : ggTarget(ggBaseUrl));

export { hostOfValue };
