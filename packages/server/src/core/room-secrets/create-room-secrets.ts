/* @layer core @kind logic */
import { ROOM_SECRET_PREFIX } from '../../lobby/lobby.constants';
import { IN_MEMORY_NOTICE } from './room-secrets.constants';
import type { RoomSecretsOptions } from './room-secrets.type';

const isRoomSecret = (name: string): boolean => name.startsWith(ROOM_SECRET_PREFIX);

const createRoomSecrets = ({ vault, canStore, log }: RoomSecretsOptions) => {
  const kept = new Map<string, string>();
  return {
    get: async (name: string) => {
      if (!isRoomSecret(name)) return vault.get(name);
      return kept.get(name) ?? (canStore() ? vault.get(name) : null);
    },
    set: async (name: string, value: string, label?: string) => {
      if (!isRoomSecret(name) || canStore()) return vault.set(name, value, label);
      if (kept.size === 0) log(IN_MEMORY_NOTICE, 'warn');
      kept.set(name, value);
      return Promise.resolve();
    },
    forget: async (name: string) => {
      kept.delete(name);
      if (isRoomSecret(name) && canStore()) await vault.delete?.(name);
    },
  };
};

export { createRoomSecrets };
