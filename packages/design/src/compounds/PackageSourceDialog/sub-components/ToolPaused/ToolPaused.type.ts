/* @layer renderer-app @kind types */
import type { SourceBuildPlan } from '@archipelia/model';
import type { PackageSourceHandlers } from '../../PackageSourceDialog.type';

type ToolPausedProps = Pick<PackageSourceHandlers, 'onBuildStart'> & { build: SourceBuildPlan; message: string; log: readonly string[] };

export type { ToolPausedProps };
