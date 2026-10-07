/* @layer renderer-app @kind logic */
import type { LiveRoomPhase } from '@archipelia/sessions/live-room';
import { LIVE_DETAIL } from '../SessionDashboard.constants';

const liveDetail = (phase: LiveRoomPhase, error: string | null): string | null => LIVE_DETAIL[phase] ?? (phase === 'live' ? null : error);

export { liveDetail };
