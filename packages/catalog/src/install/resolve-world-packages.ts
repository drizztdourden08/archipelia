/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { resolvePackages } from '@archipelia/engine';
import type { ResolvedPackage } from '@archipelia/engine';
import { failedText } from './failed-text';
import { missingOnPypi } from './missing-on-pypi';
import { namesOf } from './names-of';
import { PackageUnavailableError } from './package-unavailable-error';
import { unavailableText } from './unavailable-text';

const failure = async (label: string, declared: string[], err: unknown): Promise<Error> => {
  const gone = await missingOnPypi(namesOf(declared));
  const needs = gone.map((name) => ({ name }));
  if (needs.length > 0) return new PackageUnavailableError(unavailableText(label, needs), needs, { cause: err });
  return new Error(failedText(label, namesOf(declared), err instanceof Error ? err.message : String(err)), { cause: err });
};

const resolveWorldPackages = async (runtime: EngineRuntime, label: string, declared: string[]): Promise<ResolvedPackage[]> => {
  try {
    return await resolvePackages(runtime, declared);
  } catch (err) {
    throw await failure(label, declared, err);
  }
};

export { resolveWorldPackages };
