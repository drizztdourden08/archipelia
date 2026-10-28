/* @layer renderer-app @kind types */

type GameNoticesProps = {
  limitText: string | undefined;
  readyText: string | undefined;
  error: string | null;
  onRetry: (() => void) | undefined;
};

export type { GameNoticesProps };
