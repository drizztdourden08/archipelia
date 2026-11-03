/* @layer core @kind logic */
import type { ServiceDeps } from './service-deps.type';
import { ensureItemTypes } from '../item-types/ensure-item-types';
import { engineOfSession } from '../engine/engine-of-session';

const sessionItemTypes = (deps: ServiceDeps) => async (id: string) => {
  const session = await deps.runs.get(id);
  if (!session?.output) return false;
  const runtime = (await deps.runtimeFor?.(engineOfSession(session)).catch(() => undefined)) ?? await deps.runtime();
  return ensureItemTypes(deps, id, session.output, runtime);
};

export { sessionItemTypes };
