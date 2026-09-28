/* @layer renderer-app @kind types */
import type { LiveRoomPhase, PlayerView } from '../../../../widgets/live-room/live-room.type';

type PlayersPanelProps = {
  rows: PlayerView[];
  phase: LiveRoomPhase;
  error: string | null;
  onPassword: (password: string) => void;
};

export type { PlayersPanelProps };
