/* @layer renderer-app @kind types */
import type { LiveRoomPhase } from '../../../../widgets/live-room/live-room.type';

type LiveNoticeProps = { phase: LiveRoomPhase; error: string | null; onPassword: (password: string) => void };

export type { LiveNoticeProps };
