/* @layer client-kit @kind logic */
import type { KitIssue } from '../../errors/kit-issue.type';
import type { OptionRow } from './option-schema.type';
import type { ValidateOptionsInput, ValidatedOptions } from './validate-options.type';
import { checkOptionValue } from './check-option-value';
import { AP_COMMON_OPTION_KEYS } from './schema.constants';

const checkEntry = (
  input: ValidateOptionsInput,
  rows: ReadonlyMap<string, OptionRow>,
  [key, value]: [string, unknown],
): { value: unknown } | { issue: KitIssue } => {
  const row = rows.get(key);
  if (row === undefined) {
    if (input.allowUnknown === true || AP_COMMON_OPTION_KEYS.includes(key)) return { value };
    const known = [...rows.keys()].join(', ');
    return { issue: { key, code: 'unknown-option', message: `${key}: this world has no such option. Known options: ${known}.` } };
  }
  const result = checkOptionValue(row, value, input.allowRoll === true);
  return result.ok ? { value: result.value } : { issue: { key, code: result.code, message: result.message } };
};

const validateOptions = (input: ValidateOptionsInput): ValidatedOptions => {
  const { schema, values, withDefaults = false } = input;
  const rows = new Map(schema.map((row) => [row.key, row]));
  const issues: KitIssue[] = [];
  const out: Record<string, unknown> = {};
  if (withDefaults) {
    for (const row of schema) if ('default' in row) out[row.key] = row.default;
  }
  for (const entry of Object.entries(values)) {
    if (entry[1] === undefined) continue;
    const checked = checkEntry(input, rows, entry);
    if ('issue' in checked) issues.push(checked.issue);
    else out[entry[0]] = checked.value;
  }
  return issues.length > 0 ? { ok: false, issues } : { ok: true, values: out };
};

export { validateOptions };
