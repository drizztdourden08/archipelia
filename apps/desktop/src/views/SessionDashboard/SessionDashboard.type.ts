/* @layer renderer-app @kind types */
import type { BadgeVariant } from '@drizztdourden08/tessera/primitives';
import type { useLiveRoom } from './behavior/useLiveRoom';

type SessionText = { value: string | null; loading: boolean };

type LogTab = 'server' | 'generate' | 'spoiler';

type SessionDashboardProps = { sessionId: string };

type ConfirmActionParams = { title: string; message: string; confirmLabel: string; run: () => void };

type StatusView = { label: string; variant: BadgeVariant };

type LiveRoom = ReturnType<typeof useLiveRoom>;

export type { ConfirmActionParams, LiveRoom, LogTab, SessionDashboardProps, SessionText, StatusView };
