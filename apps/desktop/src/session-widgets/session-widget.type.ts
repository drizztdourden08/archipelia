/* @layer renderer-app @kind types */
type LiveWidgetId = 'players' | 'hints' | 'room';

type SessionWidgetId = LiveWidgetId | 'log' | 'console' | 'spoiler';

export type { LiveWidgetId, SessionWidgetId };
