/* @layer renderer-app @kind types */
import type { LiveRoomPhase } from '@archipelia/sessions/live-room';

type SessionText = { value: string | null; loading: boolean; failed: boolean };

type LogTab = 'server' | 'generate';

type SessionDashboardProps = { sessionId?: string };

type LiveConnection = {
  phase: LiveRoomPhase;
  error: string | null;
  retryAt: number | null;
  attempt: number;
  attempts: number;
  retrying: boolean;
  onPassword: (password: string) => void;
  onRetry: () => void;
};

type SentCommand = { id: number; text: string; at: number; error: string | null };

export type { LiveConnection, LogTab, SentCommand, SessionDashboardProps, SessionText };
