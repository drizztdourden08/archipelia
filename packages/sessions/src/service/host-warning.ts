/* @layer core @kind logic */
import type { HostTarget, Session } from '@archipelia/model';
import { remoteVersionWarning } from '../engine/remote-version-warning';
import type { ServiceDeps } from './service-deps.type';

const hostWarning = async (deps: ServiceDeps, session: Session, target: HostTarget): Promise<string | undefined> => {
  if (target.kind !== 'remote' || !deps.remoteApVersion) return undefined;
  const version = await deps.remoteApVersion(target.serverId).catch(() => undefined);
  return remoteVersionWarning(session, version);
};

export { hostWarning };
