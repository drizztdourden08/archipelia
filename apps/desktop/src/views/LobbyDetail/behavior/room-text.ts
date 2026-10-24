/* @layer renderer-app @kind logic */
import type { HostTarget } from '@archipelia/model';

const roomText = (target: HostTarget, remoteLabel?: string): string => {
  if (target.kind === 'local') return `On the server computer, port ${target.port}`;
  if (target.kind === 'archipelago-gg') return 'archipelago.gg';
  return `Remote server ${remoteLabel ?? target.serverId}`;
};

export { roomText };
