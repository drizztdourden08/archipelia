/* @layer core @kind logic */
import { COMPARATOR } from './version-range.constants';
import { compareVersions } from './compare-versions';

const holds = (version: string, operator: string, bound: string): boolean => {
  const order = compareVersions(version, bound);
  if (operator === '>=') return order >= 0;
  if (operator === '>') return order > 0;
  if (operator === '<=') return order <= 0;
  if (operator === '<') return order < 0;
  return order === 0;
};

const versionInRange = (version: string, range: string): boolean =>
  range
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .every((word) => {
      const match = COMPARATOR.exec(word);
      if (!match?.[2]) throw new Error(`"${word}" is not a version comparator`);
      return holds(version, match[1] ?? '=', match[2]);
    });

export { versionInRange };
