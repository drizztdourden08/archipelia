/* @layer renderer-app @kind logic */
import type { HostLogLine } from '@archipelia/hosts';
import type { SessionStatus } from '@archipelia/model';

const hostLinesOf = (hostLogs: Record<string, HostLogLine[]>, sessionId: string | undefined, status: SessionStatus | undefined) =>
  (status === 'starting' && sessionId ? (hostLogs[sessionId] ?? []).map((line) => line.text) : []);

export { hostLinesOf };
