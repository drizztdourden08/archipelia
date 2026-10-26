/* @layer renderer-app @kind logic */
import type { LobbyPhase } from '@archipelia/model';

const shownPhase = (phase: LobbyPhase, direct: boolean): LobbyPhase => (phase === 'locked' && !direct ? 'open' : phase);

export { shownPhase };
