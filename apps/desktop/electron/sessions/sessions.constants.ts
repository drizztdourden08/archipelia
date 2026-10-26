/* @layer electron-main @kind config */
import type { LobbyPhase } from '@archipelia/model';

const HOST_NAME = 'Host';

const PENDING_CLOSES_FILE = 'pending-closes.json';

const CLOSE_RETRY_MS = 5000;

const CLOSE_RETRY_MAX_MS = 300000;

const RUNNABLE_PHASES: readonly LobbyPhase[] = ['open', 'locked', 'failed'];

const TEXT = {
  notDirect: 'This session does not take direct connections.',
  notOpen: 'The lobby of this session is not open yet. Open lobby opens it.',
  gone: 'The lobby of this session is gone. Open lobby opens a new one.',
  ran: 'This session already ran on its lobby. Open lobby opens a new one for players.',
  nobodyReady: 'No player is ready yet. Approve a player who joined, or add one of your own.',
  notInstalled: (game: string) => `${game} is not installed.`,
} as const;

export { CLOSE_RETRY_MAX_MS, CLOSE_RETRY_MS, HOST_NAME, PENDING_CLOSES_FILE, RUNNABLE_PHASES, TEXT };
