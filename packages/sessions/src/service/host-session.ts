/* @layer core @kind logic */
import type { Session } from '@archipelia/model';
import { join } from 'node:path';
import type { HostRun } from './host-session.type';
import type { LiveSession } from './service-deps.type';
import { MAX_LOG_LINES } from './host-session.constants';
import { bakesPassword } from './bakes-password';
import { roomPasswordOf } from './room-password';
import { pickHostEngine } from '../engine/pick-host-engine';
import type { HostEngine } from '../engine/pick-host-engine.type';
import { hostWarning } from './host-warning';
import { warnSession } from './warn-session';

const localEngine = ({ deps, runtime }: HostRun, session: Session): Promise<HostEngine> =>
  runtime ? Promise.resolve({ runtime }) : pickHostEngine({ source: deps, session });

const hostSession = async (run: HostRun, session: Session) => {
  const { deps, live, signal } = run;
  const { server, host: hostTarget } = session.snapshot;
  const picked = hostTarget.kind === 'local' ? await localEngine(run, session) : undefined;
  const target = session.lobbyId && deps.lobbyBinding
    ? await deps.hostFor(hostTarget, picked?.runtime, deps.lobbyBinding())
    : await deps.hostFor(hostTarget, picked?.runtime);
  const entry: LiveSession = { host: target, log: [] };
  live.set(session.id, entry);
  target.onLog((line) => {
    entry.log.push(line);
    if (entry.log.length > MAX_LOG_LINES) entry.log.shift();
    deps.emit({ type: 'log', sessionId: session.id, line });
  });
  const warning = picked?.warning ?? await hostWarning(deps, session, hostTarget);
  if (warning) warnSession(deps, entry, session.id, warning);
  const sessionDir = deps.files.path(session.id);
  const seedFile = join(sessionDir, `output/${session.output?.zip}`);
  const password = bakesPassword(hostTarget) ? undefined : await roomPasswordOf(deps, session);
  return target.start({ sessionId: session.id, sessionDir, seedFile, server, password, signal });
};

export { hostSession };
