/* @layer core @kind config */
import type { SourceBuildJob } from '@archipelia/model';
import type { BuildPhase } from './build.type';

const JOB_PHASE: Record<SourceBuildJob, BuildPhase> = { venv: 'preparing', tools: 'building', wheel: 'building' };

export { JOB_PHASE };
