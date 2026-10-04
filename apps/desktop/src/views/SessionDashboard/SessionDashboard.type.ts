/* @layer renderer-app @kind types */
import type { StatusTone } from '@drizztdourden08/tessera/primitives';

type SessionText = { value: string | null; loading: boolean };

type LogTab = 'server' | 'generate' | 'spoiler';

type SessionDashboardProps = { sessionId?: string };

type StatusView = { label: string; tone: StatusTone };

export type { LogTab, SessionDashboardProps, SessionText, StatusView };
