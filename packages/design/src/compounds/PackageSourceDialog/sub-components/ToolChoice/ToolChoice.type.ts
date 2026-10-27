/* @layer renderer-app @kind types */
import type { SourceBuildPlan, SourceToolPlan } from '@archipelia/model';
import type { PackageSourceHandlers } from '../../PackageSourceDialog.type';

type ToolChoiceProps = Pick<PackageSourceHandlers, 'onToolInstall' | 'onOpenLink'> & { build: SourceBuildPlan; tool: SourceToolPlan };

export type { ToolChoiceProps };
