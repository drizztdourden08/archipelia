/* @layer renderer-app @kind logic */
import type { GameSchema } from '@archipelia/model';
import type { ValueProblem } from '@archipelia/presets';
import { optionNames } from './option-names';

const problemSummary = (schema: GameSchema, problems: ValueProblem[]) => {
  if (!problems.length) return null;
  const noun = problems.length === 1 ? 'option needs' : 'options need';
  return `${problems.length} ${noun} a fix before saving: ${optionNames(schema, problems.map((problem) => problem.key))}.`;
};

export { problemSummary };
