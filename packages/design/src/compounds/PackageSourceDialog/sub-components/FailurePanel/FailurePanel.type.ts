/* @layer renderer-app @kind types */

type FailurePanelProps = { message: string; log?: readonly string[]; onRetry?: (() => void) | undefined };

export type { FailurePanelProps };
