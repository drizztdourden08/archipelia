/* @layer testing @kind logic */
import type { FixtureLine, Scenario } from './scenario.type';
import { validateMessage } from '../../codec/validate-message';
import { resolvePlaceholders } from './resolve-placeholders';
import { sampleOf } from './sample-of';
import { unwrapHas } from './unwrap-has';

const problemsOf = (line: FixtureLine, index: number): string[] => {
  if ((line.dir !== 'c2s' && line.dir !== 's2c') || !('msg' in line) || line.invalid) return [];
  const message = resolvePlaceholders(unwrapHas(line.msg), sampleOf);
  return validateMessage(line.dir, message).map((problem) => `line ${index + 1}: ${problem.message}`);
};

const checkFixtureSchemas = (scenario: Scenario): string[] =>
  scenario.lines.flatMap((line, index) => problemsOf(line, index));

export { checkFixtureSchemas };
