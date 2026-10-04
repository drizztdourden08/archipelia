type EngineStep = 'python' | 'archipelago' | 'requirements' | 'official';

type BuildEngineOptions = {
  buildDir?: string;
  onLine?: (line: string) => void;
  onStep?: (step: EngineStep, line: string) => void;
  onSkip?: (step: EngineStep) => void;
};

declare const buildEngine: (options?: BuildEngineOptions) => Promise<string>;

export { buildEngine };
export type { BuildEngineOptions, EngineStep };
