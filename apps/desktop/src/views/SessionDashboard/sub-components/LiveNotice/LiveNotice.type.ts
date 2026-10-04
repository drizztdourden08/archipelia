/* @layer renderer-app @kind types */
import type { LiveRoomPhase } from '@archipelia/sessions/live-room';

type LiveNoticeProps = { phase: LiveRoomPhase; error: string | null; onPassword: (password: string) => void };

export type { LiveNoticeProps };
