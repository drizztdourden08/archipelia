/* @layer core @kind logic */
import type { ParsedRequirements } from './parse-requirements.type';
import { PLAIN_REQUIREMENT } from './parse-requirements.constants';

const withoutBom = (text: string) => (text.charCodeAt(0) === 0xfeff ? text.slice(1) : text);

const logicalLines = (text: string): string[] => {
  const lines: string[] = [];
  let carried = '';
  for (const raw of withoutBom(text).split(/\r?\n/)) {
    if (raw.endsWith('\\')) {
      carried += `${raw.slice(0, -1)} `;
      continue;
    }
    lines.push(carried + raw);
    carried = '';
  }
  if (carried) lines.push(carried);
  return lines;
};

const stripComment = (line: string) => line.replace(/(^|\s)#.*$/, '').trim();

const parseRequirements = (text: string): ParsedRequirements => {
  const result: ParsedRequirements = { packages: [], refused: [] };
  for (const line of logicalLines(text).map(stripComment)) {
    if (line === '') continue;
    (PLAIN_REQUIREMENT.test(line) ? result.packages : result.refused).push(line);
  }
  return result;
};

export { parseRequirements };
