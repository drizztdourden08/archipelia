/* @layer renderer-app @kind types */
import type { BuildStage, PackageSourceHandlers } from '../../PackageSourceDialog.type';

type ToolMissingProps = Pick<PackageSourceHandlers, 'onBuildStart' | 'onOpenLink' | 'onToolInstall'> & {
  stage: Extract<BuildStage, { kind: 'missing' }>;
};

export type { ToolMissingProps };
