/* @layer core @kind types */
import type { SpawnWrap } from '@archipelia/engine';

type SandboxMode = 'none' | 'bwrap';

type SandboxScope = { readOnly: string[]; readWrite: string[] };

type SandboxRunner = { mode: SandboxMode; reason?: string; confine: (scope: SandboxScope) => SpawnWrap | undefined };

type BwrapFeatures = { tmpfsSize: boolean; disableUserns: boolean; prlimit?: string | undefined };

type SandboxProbe = {
  platform: string;
  find: () => Promise<string | undefined>;
  features: (bwrap: string) => Promise<BwrapFeatures>;
  problem: (bwrap: string, features: BwrapFeatures) => Promise<string | null>;
};

export type { BwrapFeatures, SandboxMode, SandboxProbe, SandboxRunner, SandboxScope };
