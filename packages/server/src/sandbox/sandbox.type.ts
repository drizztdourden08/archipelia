/* @layer core @kind types */
import type { SpawnWrap } from '@archipelia/engine';

type SandboxMode = 'none' | 'bwrap';

type SandboxScope = { readOnly: string[]; readWrite: string[] };

type SandboxRunner = { mode: SandboxMode; reason?: string; confine: (scope: SandboxScope) => SpawnWrap | undefined };

type SandboxProbe = {
  platform: string;
  find: () => Promise<string | undefined>;
  problem: (bwrap: string) => Promise<string | null>;
};

export type { SandboxMode, SandboxProbe, SandboxRunner, SandboxScope };
