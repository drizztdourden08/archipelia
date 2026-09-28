/* @layer renderer-app @kind logic */
import type { HostTarget } from '@archipelia/model';

const hostTag = (host: HostTarget) => {
  if (host.kind === 'local') return 'local';
  return host.kind === 'archipelago-gg' ? 'gg' : 'remote';
};

export { hostTag };
