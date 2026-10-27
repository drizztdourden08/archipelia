/* @layer renderer-app @kind config */
import type { LobbyPhase, SessionStatus } from '@archipelia/model';
import type { TabPhase } from './tab-phase.type';

const RUN_PHASE: Record<SessionStatus, TabPhase> = {
  draft: 'generating', generating: 'generating', starting: 'generating', hosting: 'hosting', stopped: 'stopped', failed: 'failed',
};

const LOBBY_PHASE: Partial<Record<LobbyPhase, TabPhase>> = { generating: 'generating', hosting: 'hosting', failed: 'failed' };

export { LOBBY_PHASE, RUN_PHASE };
