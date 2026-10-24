/* @layer client-kit @kind logic */
import type { OptionChoice } from './option-schema.type';
import { isPlainRecord } from '../emit/is-plain-record';

const isChoice = (candidate: unknown): candidate is OptionChoice =>
  isPlainRecord(candidate) && typeof candidate.value === 'string' && Number.isInteger(candidate.id);

const parseOptionChoices = (label: string, raw: unknown, problems: string[]): readonly OptionChoice[] | undefined => {
  if (!Array.isArray(raw) || raw.length === 0 || !raw.every(isChoice)) {
    problems.push(`${label}: a choice needs a non-empty "choices" list of { value, id }.`);
    return undefined;
  }
  return raw.map(({ value, id }) => ({ value, id }));
};

export { parseOptionChoices };
