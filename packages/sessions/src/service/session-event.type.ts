/* @layer core @kind types */
import type { EngineProgress, Session } from '@archipelia/model';
import type { HostLogLine } from '@archipelia/hosts';

type SessionEvent =
  | { type: 'session'; session: Session }
  | { type: 'progress'; sessionId: string; progress: EngineProgress }
  | { type: 'log'; sessionId: string; line: HostLogLine }
  | { type: 'generate'; sessionId: string; line: string };

export type { SessionEvent };
