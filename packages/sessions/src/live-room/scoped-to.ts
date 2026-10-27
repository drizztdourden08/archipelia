/* @layer core @kind logic */
const scopedTo = <T extends { sessionId: string | null }>(live: T, sessionId: string | null, idle: T): T =>
  (sessionId !== null && live.sessionId === sessionId ? live : idle);

export { scopedTo };
