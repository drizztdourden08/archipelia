/* @layer core @kind types */
import type { SpawnWrap } from '@archipelia/engine';

type SandboxMode = 'none' | 'bwrap';

type SandboxScope = { readOnly: string[]; readWrite: string[]; network?: boolean; path?: string[] };

type SandboxRunner = { mode: SandboxMode; reason?: string; confine: (scope: SandboxScope) => SpawnWrap | undefined };

type BwrapFeatures = { tmpfsSize: boolean; disableUserns: boolean; prlimit?: string | undefined };

type BwrapSetup = { bwrap: string; features: BwrapFeatures; tasks?: number | undefined };

type SandboxProbe = {
  platform: string;
  find: () => Promise<string | undefined>;
  features: (bwrap: string) => Promise<BwrapFeatures>;
  problem: (bwrap: string, features: BwrapFeatures) => Promise<string | null>;
  tasks?: () => number | undefined;
};

export type { BwrapFeatures, BwrapSetup, SandboxMode, SandboxProbe, SandboxRunner, SandboxScope };
