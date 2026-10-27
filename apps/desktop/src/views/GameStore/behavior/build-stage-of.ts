/* @layer renderer-app @kind logic */
import type { BuildStage } from '@archipelia/design';
import type { SourceBuildEnd, SourceBuildPlan } from '@archipelia/model';
import { SOURCE_FAILURE } from './usePackageSource.constants';

const buildStageOf = (end: SourceBuildEnd, build: SourceBuildPlan | undefined): BuildStage => {
  if (end.status === 'missing' && build) return { kind: 'missing', build, missing: end.missing, log: end.log };
  if (end.status !== 'failed') return { kind: 'failed', build: undefined, message: SOURCE_FAILURE.build, log: end.status === 'cancelled' ? [] : end.log };
  return { kind: 'failed', build: end.retry ? build : undefined, message: end.message, log: end.log };
};

export { buildStageOf };
