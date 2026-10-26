/* @layer renderer-app @kind config */
import type { LobbyPhase } from '@archipelia/model';

const RUNNABLE_PHASES: readonly LobbyPhase[] = ['open', 'locked', 'failed'];

const RUN_TEXT = {
  run: 'Run',
  open: 'Open lobby',
  addPlayer: 'Add at least one player',
  loading: 'Loading the lobby',
  running: 'The session is running. Its dashboard shows the room.',
  nobodyReady: 'No player is ready yet. Approve a player who joined, or add one of your own.',
} as const;

export { RUN_TEXT, RUNNABLE_PHASES };
