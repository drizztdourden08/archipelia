/* @layer electron-main @kind logic */
import type { SecretStore } from '@archipelia/hosts';

const createReviewSecrets = (): SecretStore => {
  const kept = new Map<string, string>();
  return {
    get: (name) => Promise.resolve(kept.get(name) ?? null),
    set: (name, value) => {
      kept.set(name, value);
      return Promise.resolve();
    },
  };
};

export { createReviewSecrets };
