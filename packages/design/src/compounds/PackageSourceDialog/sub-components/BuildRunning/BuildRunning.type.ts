/* @layer renderer-app @kind types */
import type { BuildLogView } from '../../PackageSourceDialog.type';

type BuildRunningProps = { text: string; buildLog: BuildLogView | undefined; onCancel: (() => void) | undefined };

export type { BuildRunningProps };
