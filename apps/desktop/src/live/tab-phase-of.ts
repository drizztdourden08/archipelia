/* @layer renderer-app @kind logic */
import type { AdminLobby, Session } from '@archipelia/model';
import { LOBBY_PHASE, RUN_PHASE } from './tab-phase-of.constants';
import type { TabPhase } from './tab-phase.type';

const tabPhaseOf = (lobby: AdminLobby | undefined, run: Session | undefined): TabPhase =>
  (run ? RUN_PHASE[run.status] : undefined) ?? (lobby ? LOBBY_PHASE[lobby.phase] : undefined) ?? 'lobby';

export { tabPhaseOf };
