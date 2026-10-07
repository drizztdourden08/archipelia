/* @layer renderer-app @kind logic */
import type { GameSchema } from '@archipelia/model';
import type { ValueProblem } from '@archipelia/presets';
import { problemSummary } from './problem-summary';
import { optionNames } from './option-names';

const saveBlock = (schema: GameSchema, name: string, problems: ValueProblem[], unparsed: readonly string[]): string | null => {
  if (!name.trim()) return 'Give the preset a name before saving.';
  if (unparsed.length) return `Fix the JSON of ${optionNames(schema, unparsed)} before saving.`;
  return problemSummary(schema, problems);
};

export { saveBlock };
