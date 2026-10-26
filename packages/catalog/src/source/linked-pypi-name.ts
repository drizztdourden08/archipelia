/* @layer core @kind logic */
import type { SourceRef } from '@archipelia/model';
import { planSource } from './plan-source';
import type { PlanDeps } from './source.type';

const linkedPypiName = async (deps: PlanDeps, ref: SourceRef): Promise<string> => {
  const { pypi } = await planSource(deps, ref);
  if (!pypi?.linked) throw new Error(`${ref.owner}/${ref.repo} does not name a Python Package Index project that points back to it.`);
  return pypi.name;
};

export { linkedPypiName };
