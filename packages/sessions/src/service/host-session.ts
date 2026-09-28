/* @layer core @kind logic */
import type { Session } from '@archipelia/model';
import { join } from 'node:path';
import type { HostRun } from './host-session.type';
import type { LiveSession } from './service-deps.type';
import { MAX_LOG_LINES } from './host-session.constants';
import { sessionDirOf } from '../store/session-dir-of';
import { bakesPassword } from './bakes-password';
import { roomPasswordOf } from './room-password';

const hostSession = async ({ deps, live, signal }: HostRun, session: Session) => {
  const target = await deps.hostFor(session.snapshot.host);
  const entry: LiveSession = { host: target, log: [] };
  live.set(session.id, entry);
  target.onLog((line) => {
    entry.log.push(line);
    if (entry.log.length > MAX_LOG_LINES) entry.log.shift();
    deps.emit({ type: 'log', sessionId: session.id, line });
  });
  const sessionDir = join(deps.dataRoot, sessionDirOf(session.id));
  const seedFile = join(sessionDir, `output/${session.output?.zip}`);
  const { server, host: hostTarget } = session.snapshot;
  const password = bakesPassword(hostTarget) ? undefined : await roomPasswordOf(deps, session);
  return target.start({ sessionId: session.id, sessionDir, seedFile, server, password, signal });
};

export { hostSession };
