/* @layer renderer-app @kind config */
import type { LobbyPhase } from '@archipelia/model';

const RUNNABLE_PHASES: readonly LobbyPhase[] = ['open', 'locked', 'failed'];

const RUN_TEXT = {
  run: 'Run',
  start: 'Start session',
  addPlayer: 'Add at least one player.',
  loading: 'Loading the lobby',
  running: 'The session is running. Its room shows in this tab.',
  nobodyReady: 'No player is ready yet. Add a player of your own, or approve a player who joined.',
} as const;

export { RUN_TEXT, RUNNABLE_PHASES };
