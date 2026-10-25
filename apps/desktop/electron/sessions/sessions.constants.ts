/* @layer electron-main @kind config */
import type { LobbyPhase } from '@archipelia/model';

const HOST_NAME = 'Host';

const PENDING_CLOSES_FILE = 'pending-closes.json';

const CLOSE_RETRY_MS = 5000;

const CLOSE_RETRY_MAX_MS = 300000;

const RUNNABLE_PHASES: readonly LobbyPhase[] = ['open', 'locked', 'failed'];

const TEXT = {
  notDirect: 'This session does not take direct connections.',
  gone: 'The lobby of this session is gone. Turn Allow direct connection off and on again to open a new one.',
  ran: 'This session already ran on its lobby. Turn Allow direct connection off and on again to open a new one for players.',
  notInstalled: (game: string) => `${game} is not installed.`,
} as const;

export { CLOSE_RETRY_MAX_MS, CLOSE_RETRY_MS, HOST_NAME, PENDING_CLOSES_FILE, RUNNABLE_PHASES, TEXT };
