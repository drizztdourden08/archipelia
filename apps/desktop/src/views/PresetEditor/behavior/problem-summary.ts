/* @layer renderer-app @kind logic */
import type { GameSchema } from '@archipelia/model';
import type { ValueProblem } from '@archipelia/presets';
import { NAMES_SHOWN } from '../PresetEditor.constants';

const problemSummary = (schema: GameSchema, problems: ValueProblem[]) => {
  if (!problems.length) return null;
  const names = problems.map((problem) => schema.options.find((def) => def.key === problem.key)?.displayName ?? problem.key);
  const more = names.length > NAMES_SHOWN ? ` and ${names.length - NAMES_SHOWN} more` : '';
  const noun = problems.length === 1 ? 'option needs' : 'options need';
  return `${problems.length} ${noun} a fix before saving: ${names.slice(0, NAMES_SHOWN).join(', ')}${more}.`;
};

export { problemSummary };
