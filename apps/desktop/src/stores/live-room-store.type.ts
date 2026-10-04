/* @layer renderer-app @kind types */
import type { HintView, LiveRoomPhase, LiveRoomTarget, RoomPlayer, WatchedChecks } from '../live-room/live-room.type';

type LiveRoomData = {
  sessionId: string | null;
  phase: LiveRoomPhase;
  error: string | null;
  players: RoomPlayer[];
  statuses: Record<string, unknown>;
  hints: HintView[];
  watched: WatchedChecks | null;
  passwordRequired: boolean;
};

type LiveRoomState = LiveRoomData & {
  connect: (target: LiveRoomTarget, password?: string) => Promise<void>;
  disconnect: () => void;
};

export type { LiveRoomData, LiveRoomState };
