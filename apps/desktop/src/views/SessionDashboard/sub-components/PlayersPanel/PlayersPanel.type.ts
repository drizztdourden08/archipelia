/* @layer renderer-app @kind types */
import type { LiveRoomPhase, PlayerView } from '@archipelia/sessions/live-room';

type PlayersPanelProps = {
  rows: PlayerView[];
  phase: LiveRoomPhase;
  error: string | null;
  onPassword: (password: string) => void;
  onRetry: () => void;
};

export type { PlayersPanelProps };
