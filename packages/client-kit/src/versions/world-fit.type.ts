/* @layer client-kit @kind types */

type WorldRange = { game?: string; worldVersion?: string; minimumAp?: string; maximumAp?: string };

type WorldFit =
  | { fits: true }
  | { fits: false; reason: 'invalid-version' | 'too-old' | 'too-new'; message: string };

export type { WorldFit, WorldRange };
