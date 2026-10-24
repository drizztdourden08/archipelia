/* @layer core @kind types */
type EngineStage = 'rolling' | 'worlds' | 'items' | 'rules' | 'fill' | 'balance' | 'output' | 'archive' | 'done';

type EngineProgress = { stage: EngineStage; done?: number; total?: number; detail?: string };

type EngineRuntime = {
  id: string;
  apVersion: string;
  apCommit: string;
  pythonVersion: string;
  root: string;
  python: string;
  generate: string;
  multiServer: string;
  schemaScript: string;
};

type EngineState = 'missing' | 'building' | 'ready' | 'failed';

type EngineStatus = { state: EngineState; dir: string; id?: string; apVersion?: string; pythonVersion?: string; error?: string };

export type { EngineProgress, EngineRuntime, EngineStage, EngineState, EngineStatus };
