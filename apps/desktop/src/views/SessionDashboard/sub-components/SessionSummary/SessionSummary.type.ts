/* @layer renderer-app @kind types */
import type { HintView, LiveRoomPhase, PlayerView } from '../../../../widgets/live-room/live-room.type';

type SessionSummaryProps = { players: PlayerView[]; hints: HintView[]; phase: LiveRoomPhase; uptime: string | null; status: string };

export type { SessionSummaryProps };
