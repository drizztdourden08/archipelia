/* @layer renderer-app @kind logic */
import type { SourceBuildMissing, SourceBuildPlan, SourceToolPlan } from '@archipelia/model';
import { appApi } from '../../../ipc/app-api';

const sourceToolPlan = (build: SourceBuildPlan, missing: SourceBuildMissing): Promise<SourceToolPlan | undefined> =>
  appApi().sourcesToolPlan({ tool: missing.tool, buildId: build.buildId }).catch(() => undefined);

export { sourceToolPlan };
