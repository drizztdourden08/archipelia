/* @layer client-kit @kind logic */
import type { CheckResult } from './check.type';
import type { OptionRow } from '../option-schema.type';
import { describeValue } from './describe-value';

const firstRepeat = (names: readonly string[]): string | undefined =>
  names.find((name, index) => names.indexOf(name) !== index);

const checkNameList = ({ key, names = [] }: OptionRow, value: unknown, unique: boolean): CheckResult => {
  if (!Array.isArray(value)) {
    return { ok: false, code: 'wrong-type', message: `${key}: expected a list of names, got ${describeValue(value)}.` };
  }
  const given: unknown[] = value;
  const badIndex = given.findIndex((name) => typeof name !== 'string' || !names.includes(name));
  if (badIndex >= 0) {
    return { ok: false, code: 'bad-choice', message: `${key}: ${describeValue(given[badIndex])} is not one of: ${names.join(', ')}.` };
  }
  const listed = given as string[];
  const repeated = unique ? firstRepeat(listed) : undefined;
  if (repeated !== undefined) {
    return { ok: false, code: 'duplicate-value', message: `${key}: ${describeValue(repeated)} is listed twice in a set.` };
  }
  return { ok: true, value: [...listed] };
};

export { checkNameList };
