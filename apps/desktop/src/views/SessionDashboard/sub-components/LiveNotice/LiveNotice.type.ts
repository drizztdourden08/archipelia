/* @layer renderer-app @kind types */
import type { LiveRoomPhase } from '../../../../live-room/live-room.type';

type LiveNoticeProps = { phase: LiveRoomPhase; error: string | null; onPassword: (password: string) => void };

export type { LiveNoticeProps };
