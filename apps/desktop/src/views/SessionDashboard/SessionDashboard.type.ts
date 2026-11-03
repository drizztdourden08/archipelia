/* @layer renderer-app @kind types */
import type { StatusTone } from '@drizztdourden08/tessera/primitives';
import type { PlayerStatusRowProps } from '@archipelia/design';
import type { LiveRoomPhase } from '@archipelia/sessions/live-room';

type SessionText = { value: string | null; loading: boolean; failed: boolean };

type SessionDashboardProps = { sessionId: string };

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

type RowLook = { label: string; tone: StatusTone };

type PlayerKind = 'set' | 'direct';

type RunRow = Omit<PlayerStatusRowProps, 'menu'>;

export type { LiveConnection, PlayerKind, RowLook, RunRow, SentCommand, SessionDashboardProps, SessionText };
