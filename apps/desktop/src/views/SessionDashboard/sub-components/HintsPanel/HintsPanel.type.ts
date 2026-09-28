/* @layer renderer-app @kind types */
import type { HintView, LiveRoomPhase } from '../../../../widgets/live-room/live-room.type';

type HintsPanelProps = {
  rows: HintView[];
  phase: LiveRoomPhase;
  error: string | null;
  onPassword: (password: string) => void;
};

export type { HintsPanelProps };
