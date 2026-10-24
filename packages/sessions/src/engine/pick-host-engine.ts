/* @layer core @kind logic */
import { compareVersions } from '@archipelia/engine';
import { engineOfSession } from './engine-of-session';
import type { HostEngine, HostEngineRequest } from './pick-host-engine.type';

const pickHostEngine = async ({ source, session }: HostEngineRequest): Promise<HostEngine> => {
  const recorded = engineOfSession(session);
  const own = await source.runtimeFor?.(recorded).catch(() => undefined);
  if (own) return { runtime: own };
  const active = await source.runtime();
  if (compareVersions(active.apVersion, recorded.ap) >= 0) return { runtime: active };
  return {
    runtime: active,
    warning: `This session was generated with Archipelago ${recorded.ap} and its engine is gone. Hosting it with the older Archipelago ${active.apVersion}.`,
  };
};

export { pickHostEngine };
