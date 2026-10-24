/* @layer client-kit @kind logic */
import { isPlainRecord } from '../emit/is-plain-record';

const parseOptionRange = (label: string, raw: unknown, problems: string[]): { min: number; max: number } | undefined => {
  if (isPlainRecord(raw) && typeof raw.min === 'number' && typeof raw.max === 'number' && raw.min <= raw.max) {
    return { min: raw.min, max: raw.max };
  }
  problems.push(`${label}: a range needs "range" as { min, max } with min not above max.`);
  return undefined;
};

export { parseOptionRange };
