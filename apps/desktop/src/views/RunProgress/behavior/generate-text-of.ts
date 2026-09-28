/* @layer renderer-app @kind logic */
import { LINE_BREAK } from '../RunProgress.constants';

const generateTextOf = (logText: string | null, streamed: Record<string, string[]>, sessionId: string | undefined) =>
  logText ?? (sessionId ? (streamed[sessionId] ?? []).join(LINE_BREAK) : null);

export { generateTextOf };
