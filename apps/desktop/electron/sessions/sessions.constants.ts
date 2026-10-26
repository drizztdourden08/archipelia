/* @layer electron-main @kind config */
import type { LobbyPhase } from '@archipelia/model';

const HOST_NAME = 'Host';

const PENDING_CLOSES_FILE = 'pending-closes.json';

const CLOSE_RETRY_MS = 5000;

const CLOSE_RETRY_MAX_MS = 300000;

const RUNNABLE_PHASES: readonly LobbyPhase[] = ['open', 'locked', 'failed'];

const TEXT = {
  notStarted: 'This session is not started yet. Start session opens its lobby.',
  gone: 'The lobby of this session is gone. Start session opens a new one.',
  ran: 'This session already ran on its lobby. Close the lobby, then Start session opens a new one.',
  nobodyReady: 'No player is ready yet. Add a player of your own, or approve a player who joined.',
  notInstalled: (game: string) => `${game} is not installed.`,
} as const;

export { CLOSE_RETRY_MAX_MS, CLOSE_RETRY_MS, HOST_NAME, PENDING_CLOSES_FILE, RUNNABLE_PHASES, TEXT };
