/* @layer core @kind logic */
import type { ParsedRequirements } from './parse-requirements.type';
import { isValidMarker } from './is-valid-marker';
import { ARCHIVE_NAME, PLAIN_REQUIREMENT } from './parse-requirements.constants';

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

const isPlain = (line: string): boolean => {
  const cut = line.indexOf(';');
  const head = (cut === -1 ? line : line.slice(0, cut)).trim();
  const name = PLAIN_REQUIREMENT.exec(head)?.[1];
  if (name === undefined || ARCHIVE_NAME.test(name)) return false;
  return cut === -1 || isValidMarker(line.slice(cut + 1));
};

const parseRequirements = (text: string): ParsedRequirements => {
  const result: ParsedRequirements = { packages: [], refused: [] };
  for (const line of logicalLines(text).map(stripComment)) {
    if (line === '') continue;
    (isPlain(line) ? result.packages : result.refused).push(line);
  }
  return result;
};

export { parseRequirements };
