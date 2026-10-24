/* @layer renderer-app @kind logic */
import type { HostTarget, ServerEntry } from '@archipelia/model';
import { DEFAULT_GG_SITE } from '../LobbyCreate.constants';
import type { RoomDefaults, RoomKind } from '../LobbyCreate.type';

const roomOfKind = (kind: RoomKind, current: HostTarget, machines: readonly ServerEntry[], defaults: RoomDefaults): HostTarget => {
  if (kind === current.kind) return current;
  if (kind === 'local') return { kind, port: defaults.port };
  if (kind === 'remote') return { kind, serverId: machines[0]?.id ?? '' };
  return defaults.ggBaseUrl && defaults.ggBaseUrl !== DEFAULT_GG_SITE ? { kind, baseUrl: defaults.ggBaseUrl } : { kind };
};

export { roomOfKind };
