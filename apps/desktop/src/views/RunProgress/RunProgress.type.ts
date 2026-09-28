/* @layer renderer-app @kind types */
import type { EngineProgress, Session, SessionTemplate } from '@archipelia/model';

type RunViewInput = { session?: Session; launch: RunLaunch | null; progress?: EngineProgress; failed: boolean };

type RunLaunch = {
  name: string;
  template?: SessionTemplate;
  startedAt: number;
  templateId?: string;
  sessionId?: string;
  error?: string;
  inspect?: boolean;
};

type RunProgressProps = { launch: RunLaunch | null; onClose: () => void };

type RunLogInput = { generateText: string | null; hostLines: string[]; showLog: boolean };

type StepState = 'done' | 'current' | 'pending';

type RunStep = { id: string; label: string; state: StepState };

type Band = { from: number; to: number };

type GenerateLogParams = { sessionId?: string; startedAt?: number; failed: boolean };

export type { Band, GenerateLogParams, RunLaunch, RunLogInput, RunProgressProps, RunStep, RunViewInput, StepState };
