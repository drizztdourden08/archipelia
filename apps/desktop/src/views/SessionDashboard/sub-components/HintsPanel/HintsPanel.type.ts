/* @layer renderer-app @kind types */
import type { HintView, LiveRoomPhase } from '@archipelia/sessions/live-room';

type HintsPanelProps = {
  rows: HintView[];
  phase: LiveRoomPhase;
  error: string | null;
  onPassword: (password: string) => void;
};

export type { HintsPanelProps };
