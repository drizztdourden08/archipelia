/* @layer core @kind logic */
import type { EngineRuntime, Session } from '@archipelia/model';
import type { ServiceDeps } from './service-deps.type';

const hostForSession = (deps: ServiceDeps, session: Session, runtime: EngineRuntime | undefined) => {
  const { host } = session.snapshot;
  return session.lobbyId && deps.lobbyBinding ? deps.hostFor(host, runtime, deps.lobbyBinding()) : deps.hostFor(host, runtime);
};

export { hostForSession };
