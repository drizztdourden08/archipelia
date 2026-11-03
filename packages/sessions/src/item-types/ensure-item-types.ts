/* @layer core @kind logic */
import { writeItemTypes } from '@archipelia/engine';
import type { EngineRuntime, SessionOutput } from '@archipelia/model';
import type { ServiceDeps } from '../service/service-deps.type';
import { itemTypesNameOf } from './item-types-name';
import { logItemTypesFailure } from './log-item-types-failure';

const ensureItemTypes = async (deps: ServiceDeps, sessionId: string, output: SessionOutput, runtime: EngineRuntime) => {
  if (!output.spoiler) return false;
  const { files } = deps;
  const rel = `${sessionId}/output/${itemTypesNameOf(output.spoiler)}`;
  try {
    if (await files.exists(rel)) return true;
    await writeItemTypes(runtime, { zip: files.path(`${sessionId}/output/${output.zip}`), out: files.path(rel) });
    return true;
  } catch (error) {
    await logItemTypesFailure(deps, sessionId, output, error);
    return false;
  }
};

export { ensureItemTypes };
