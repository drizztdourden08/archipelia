/* @layer renderer-app @kind logic */
import type { ValueProblem } from '@archipelia/presets';

const problemMap = (problems: ValueProblem[]) => new Map(problems.map((problem) => [problem.key, `Expected ${problem.expected}.`]));

export { problemMap };
