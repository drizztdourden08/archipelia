/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { resolvePackages } from '@archipelia/engine';
import type { ResolvedPackage } from '@archipelia/engine';
import { failedText } from './failed-text';
import { namesOf } from './names-of';

const resolveWorldPackages = async (runtime: EngineRuntime, label: string, declared: string[]): Promise<ResolvedPackage[]> => {
  try {
    return await resolvePackages(runtime, declared);
  } catch (err) {
    throw new Error(failedText(label, namesOf(declared), err instanceof Error ? err.message : String(err)), { cause: err });
  }
};

export { resolveWorldPackages };
