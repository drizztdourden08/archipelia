/* @layer core @kind logic */
import type { SourcePlan, SourceRef } from '@archipelia/model';
import { BUILD_TEXT } from './build-text.constants';

const keyOf = ({ owner, repo, module }: SourceRef) => `${owner}/${repo}/${module}`.toLowerCase();

const createPlannedSources = () => {
  const planned = new Map<string, SourcePlan>();
  return {
    remember: (plan: SourcePlan): void => { planned.set(keyOf(plan), plan); },
    recall: (ref: SourceRef): SourcePlan => {
      const found = planned.get(keyOf(ref));
      if (!found) throw new Error(BUILD_TEXT.notPlanned);
      return found;
    },
  };
};

export { createPlannedSources };
