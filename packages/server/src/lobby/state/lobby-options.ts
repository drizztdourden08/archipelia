/* @layer core @kind logic */
import { DEFAULT_LIMITS } from '@drizztdourden08/archipelia-lobby-protocol';
import type { LobbyOptions } from '@archipelia/model';
import { DEFAULT_MAX_SLOTS, DEFAULT_ROOM_PORT, LOBBY_GENERATOR, LOBBY_SERVER } from '../lobby.constants';

const lobbyOptions = (patch: Partial<LobbyOptions> = {}): LobbyOptions => ({
  admission: 'host-approval',
  allowUnlisted: false,
  maxSlots: DEFAULT_MAX_SLOTS,
  limits: { worldBytes: DEFAULT_LIMITS.maxWorldBytes, yamlBytes: DEFAULT_LIMITS.maxYamlBytes, memberBytes: DEFAULT_LIMITS.maxMemberBytes },
  room: { kind: 'local', port: DEFAULT_ROOM_PORT },
  generator: { ...LOBBY_GENERATOR },
  server: { ...LOBBY_SERVER },
  ...patch,
});

export { lobbyOptions };
