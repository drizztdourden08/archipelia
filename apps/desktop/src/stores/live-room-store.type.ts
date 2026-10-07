/* @layer renderer-app @kind types */
import type { HintView, LiveRoomPhase, LiveRoomTarget, RoomPlayer, WatchedChecks } from '@archipelia/sessions/live-room';

type LiveRoomRetry = {
  retryAt: number | null;
  attempt: number;
  attempts: number;
  retrying: boolean;
};

type LiveRoomData = LiveRoomRetry & {
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
  retry: () => void;
  disconnect: () => void;
};

type LiveRoomPatch = Partial<LiveRoomData>;

type LiveRoomSet = (patch: LiveRoomPatch | ((state: LiveRoomState) => LiveRoomPatch)) => void;

export type { LiveRoomData, LiveRoomRetry, LiveRoomSet, LiveRoomState };
