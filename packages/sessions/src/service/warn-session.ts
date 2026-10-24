/* @layer core @kind logic */
import type { ServiceDeps, LiveSession } from './service-deps.type';

const warnSession = (deps: ServiceDeps, entry: LiveSession, sessionId: string, text: string) => {
  const line = { at: Date.now(), text: `Warning: ${text}` };
  entry.log.push(line);
  deps.emit({ type: 'log', sessionId, line });
};

export { warnSession };
