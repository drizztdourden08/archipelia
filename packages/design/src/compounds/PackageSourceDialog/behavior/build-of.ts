/* @layer renderer-app @kind logic */
import type { SourceBuildPlan } from '@archipelia/model';
import type { BuildStage } from '../PackageSourceDialog.type';

const buildOf = (stage: BuildStage | undefined): SourceBuildPlan | undefined => (stage && 'build' in stage ? stage.build : undefined);

export { buildOf };
