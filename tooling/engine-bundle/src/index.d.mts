import type { EngineSpec } from '@archipelia/engine';

type EngineStep = 'python' | 'archipelago' | 'requirements' | 'official';

type RequirementRule = EngineSpec['requirements']['rules'][number];

type BuildEngineOptions = {
  buildDir?: string;
  spec: EngineSpec;
  verifySource?: (apRoot: string) => Promise<string | undefined | void>;
  onLine?: (line: string) => void;
  onStep?: (step: EngineStep, line: string) => void;
  onSkip?: (step: EngineStep) => void;
  signal?: AbortSignal;
};

declare const buildEngine: (options: BuildEngineOptions) => Promise<string>;

declare const defaultSpec: (target?: string) => EngineSpec;

declare const engineId: (ap: string, python: string, target: string) => string;

export { buildEngine, defaultSpec, engineId };
export type { BuildEngineOptions, EngineSpec, EngineStep, RequirementRule };
