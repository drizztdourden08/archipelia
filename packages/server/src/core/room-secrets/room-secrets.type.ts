/* @layer core @kind types */
import type { SecretStore } from '@archipelia/hosts';

type RoomSecretsOptions = {
  vault: SecretStore;
  canStore: () => boolean;
  log: (message: string, level?: 'info' | 'warn' | 'error') => void;
};

export type { RoomSecretsOptions };
