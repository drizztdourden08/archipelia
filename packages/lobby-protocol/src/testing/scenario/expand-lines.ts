/* @layer testing @kind logic */
import type { FixtureLine } from './scenario.type';
import type { RawLine } from './expand-lines.type';
import { KNOWN_DIRS } from './expand-lines.constants';

const expandLines = (raw: RawLine[], where: string): FixtureLine[] =>
  raw.flatMap((line, index) => {
    if (line.dir === 'repeat') {
      const times = Number(line.times);
      const body = Array.isArray(line.lines) ? (line.lines as RawLine[]) : [];
      const once = expandLines(body, `${where}.${index + 1}`);
      return Array.from({ length: times }, () => once).flat();
    }
    if (typeof line.dir !== 'string' || !KNOWN_DIRS.includes(line.dir)) {
      throw new Error(`${where} line ${index + 1}: the direction ${String(line.dir)} is not known`);
    }
    return [line as FixtureLine];
  });

export { expandLines };
