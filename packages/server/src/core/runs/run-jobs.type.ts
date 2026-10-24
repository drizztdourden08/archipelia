/* @layer core @kind types */
import type { JobHandle, StartJob } from '@drizztdourden08/brock-core/jobs';
import type { EngineStage } from '@archipelia/model';

type RunEngineStep = { id: string; stages: EngineStage[]; weight: number; label: (players: number) => string };

type RunStepAt = { step: string; fraction: number; line: string };

type RunJob = { handle: JobHandle; step: string | null };

type RunJobsDeps = { job: StartJob; cancel: (sessionId: string) => Promise<void> };

export type { RunEngineStep, RunJob, RunJobsDeps, RunStepAt };
