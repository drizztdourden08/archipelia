/* @layer core @kind types */
import type { SecretStore } from '@archipelia/hosts';

type RoomVault = SecretStore & { delete?: (name: string) => Promise<unknown> };

type ForgettingStore = SecretStore & { forget: (name: string) => Promise<void> };

type RoomSecretsOptions = {
  vault: RoomVault;
  canStore: () => boolean;
  log: (message: string, level?: 'info' | 'warn' | 'error') => void;
};

export type { ForgettingStore, RoomSecretsOptions, RoomVault };
