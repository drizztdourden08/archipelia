/* @layer renderer-app @kind types */
type SessionText = { value: string | null; loading: boolean };

type LogTab = 'server' | 'generate' | 'spoiler';

type SessionDashboardProps = { sessionId?: string };

export type { LogTab, SessionDashboardProps, SessionText };
