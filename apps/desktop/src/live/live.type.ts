/* @layer renderer-app @kind types */
import type { AdminLobby, DirectConnection, GeneratorSettings, RunOverride, ServerSettings, SessionPlayer } from '@archipelia/model';

type RunnableServerSettings = Pick<ServerSettings, 'hintCost' | 'releaseMode' | 'collectMode' | 'remainingMode' | 'autoShutdownMinutes'>;

type SessionOverrides = {
  players?: SessionPlayer[];
  lan?: boolean;
  direct?: DirectConnection | null;
  server?: Partial<RunnableServerSettings>;
  generator?: Partial<GeneratorSettings>;
};

type LiveTab = {
  tabId: string;
  sessionId: string;
  serverId: string;
  lobbyId: string;
  runId?: string;
  overrides: SessionOverrides;
  changes: RunOverride[];
  lan: boolean;
  direct: boolean;
  openedAt: number;
};

type LiveStart = { tab: LiveTab; lobby: AdminLobby };

type LiveCloseMode = 'lobby' | 'room' | 'run';

export type { LiveCloseMode, LiveStart, LiveTab, RunnableServerSettings, SessionOverrides };
