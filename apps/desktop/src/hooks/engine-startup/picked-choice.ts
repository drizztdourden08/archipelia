/* @layer renderer-app @kind logic */
import type { EngineChoice, EngineOverview } from '@archipelia/model';
import { choicePlan } from '../../views/EngineSettings/behavior/choice-plan';
import { chosenVersions } from '../../views/EngineSettings/behavior/chosen-versions';

const pickedChoice = (overview: EngineOverview | null, choice: EngineChoice, ap: string): EngineChoice | undefined => {
  if (ap === choice.ap) return choice;
  if (!overview) return undefined;
  const plan = choicePlan(overview, chosenVersions(overview, { ap, python: choice.python }));
  return plan.kind === 'install' ? plan.choice : undefined;
};

export { pickedChoice };
