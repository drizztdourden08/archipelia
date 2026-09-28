/* @layer renderer-app @kind logic */
import type { HostTarget } from '@archipelia/model';

const withServer = (current: HostTarget, serverId: string): HostTarget => (current.kind === 'remote' ? { kind: 'remote', serverId } : current);

export { withServer };
