/* @layer renderer-app @kind types */
type SessionText = { value: string | null; loading: boolean; failed: boolean };

type LogTab = 'server' | 'generate';

type SessionDashboardProps = { sessionId?: string };

export type { LogTab, SessionDashboardProps, SessionText };
