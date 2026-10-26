/* @layer core @kind logic */
import type { SourceBuildMissing } from '@archipelia/model';
import { FAILURE_RULES, HEADER_FILE } from './build.constants';

const classifyBuildFailure = (lines: readonly string[]): SourceBuildMissing | undefined => {
  const text = lines.join('\n');
  const rule = FAILURE_RULES.find((entry) => entry.pattern.test(text));
  if (rule) return { tool: rule.tool };
  const header = HEADER_FILE.exec(text)?.[1];
  return header === undefined ? undefined : { tool: 'headers', detail: header };
};

export { classifyBuildFailure };
