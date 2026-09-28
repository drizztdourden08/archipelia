/* @layer renderer-app @kind logic */
import type { EngineProgress, HostTarget, SessionStatus } from '@archipelia/model';
import type { RunStep, StepState } from '../RunProgress.type';
import { STEP_STAGES } from '../RunProgress.constants';

const hostStepLabel = (host: HostTarget | undefined) => {
  if (host?.kind === 'archipelago-gg') return 'Uploading to archipelago.gg';
  if (host?.kind === 'remote') return 'Starting the remote server';
  return 'Starting the local server';
};

const stepState = (index: number, current: number): StepState => {
  if (index < current) return 'done';
  return index === current ? 'current' : 'pending';
};

const currentStep = (status: SessionStatus | undefined, progress: EngineProgress | undefined) => {
  if (status === 'hosting') return STEP_STAGES.length + 1;
  if (status === 'starting') return STEP_STAGES.length;
  if (!progress) return 0;
  const found = STEP_STAGES.findIndex((step) => step.stages.includes(progress.stage));
  return progress.stage === 'done' ? STEP_STAGES.length : Math.max(0, found);
};

const stepsOf = (status: SessionStatus | undefined, progress: EngineProgress | undefined, players: number, host?: HostTarget): RunStep[] => {
  const current = currentStep(status, progress);
  const engine = STEP_STAGES.map((step, index) => ({ id: step.id, label: step.label(players), state: stepState(index, current) }));
  return [...engine, { id: 'host', label: hostStepLabel(host), state: stepState(STEP_STAGES.length, current) }];
};

export { stepsOf };
