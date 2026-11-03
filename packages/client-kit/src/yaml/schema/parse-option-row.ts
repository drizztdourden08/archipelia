/* @layer client-kit @kind logic */
import type { OptionRow, OptionType, RowParse } from './option-schema.type';
import { isPlainRecord } from '../emit/is-plain-record';
import { checkRowDefault } from './check-row-default';
import { parseOptionChoices } from './parse-option-choices';
import { parseOptionNames } from './parse-option-names';
import { parseOptionRange } from './parse-option-range';
import { OPTION_TYPES } from './schema.constants';

const withTypeDetails = (row: OptionRow, raw: Record<string, unknown>, problems: string[]): OptionRow => {
  const { key, type } = row;
  const detailed: OptionRow = { ...row };
  if (type === 'choice') {
    detailed.choices = parseOptionChoices(key, raw.choices, problems);
    detailed.numeric = raw.numeric === true;
  }
  if (type === 'range') detailed.range = parseOptionRange(key, raw.range, problems);
  if (type === 'set' || type === 'list') detailed.names = parseOptionNames(key, raw.names, problems);
  return detailed;
};

const withDetails = (row: OptionRow, raw: Record<string, unknown>, problems: string[]): OptionRow => {
  const detailed: OptionRow = { ...row };
  if (typeof raw.displayName === 'string') detailed.displayName = raw.displayName;
  if (typeof raw.description === 'string') detailed.description = raw.description;
  if ('default' in raw) detailed.default = raw.default;
  if (typeof raw.locked === 'boolean') detailed.locked = raw.locked;
  const typed = withTypeDetails(detailed, raw, problems);
  checkRowDefault(typed, problems);
  return typed;
};

const parseOptionRow = (raw: unknown, index: number): RowParse => {
  if (!isPlainRecord(raw)) return { row: null, problems: [`row ${index}: must be an object.`] };
  const problems: string[] = [];
  const key = typeof raw.key === 'string' && raw.key !== '' ? raw.key : null;
  if (key === null) problems.push(`row ${index}: "key" must be a non-empty text.`);
  const type: OptionType | undefined = OPTION_TYPES.find((candidate) => candidate === raw.type);
  if (type === undefined) problems.push(`${key ?? `row ${index}`}: "type" must be one of ${OPTION_TYPES.join(', ')}.`);
  if (key === null || type === undefined) return { row: null, problems };
  const row = withDetails({ key, type }, raw, problems);
  return { row: problems.length === 0 ? row : null, problems };
};

export { parseOptionRow };
