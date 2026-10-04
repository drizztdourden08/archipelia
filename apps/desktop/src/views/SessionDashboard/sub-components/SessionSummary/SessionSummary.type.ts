/* @layer renderer-app @kind types */
import type { HintView, LiveRoomPhase, PlayerView } from '@archipelia/sessions/live-room';

type SessionSummaryProps = { players: PlayerView[]; hints: HintView[]; phase: LiveRoomPhase; uptime: string | null; status: string };

export type { SessionSummaryProps };
