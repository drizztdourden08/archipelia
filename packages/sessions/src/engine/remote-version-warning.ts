/* @layer core @kind logic */
import { compareVersions } from '@archipelia/engine';
import type { Session } from '@archipelia/model';
import { engineOfSession } from './engine-of-session';

const remoteVersionWarning = (session: Pick<Session, 'engine'>, serverVersion: string | undefined): string | undefined => {
  const recorded = engineOfSession(session);
  if (!serverVersion || compareVersions(serverVersion, recorded.ap) >= 0) return undefined;
  return `This session was generated with Archipelago ${recorded.ap}. The server last tested with ${serverVersion}. It may refuse the seed.`;
};

export { remoteVersionWarning };
