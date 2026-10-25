/* @layer renderer-app @kind logic */
import type { ValueProblem } from '@archipelia/presets';

const problemSummary = (problems: ValueProblem[]) => {
  if (!problems.length) return null;
  const noun = problems.length === 1 ? 'option needs' : 'options need';
  return `${problems.length} ${noun} a fix before saving. They are listed above the options.`;
};

export { problemSummary };
