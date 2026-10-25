/* @layer core @kind logic */
import type { EngineRuntime } from '@archipelia/model';
import { installPackages } from '@archipelia/engine';
import { failedText } from './failed-text';
import { namesOf } from './names-of';

const installWorldPackages = async (runtime: EngineRuntime, label: string, packages: string[]): Promise<void> => {
  if (packages.length === 0) return;
  try {
    await installPackages(runtime, packages);
  } catch (err) {
    throw new Error(failedText(label, namesOf(packages), err instanceof Error ? err.message : String(err)), { cause: err });
  }
};

export { installWorldPackages };
