/* @layer client-kit @kind logic */
import type { CheckResult } from './checks/check.type';
import type { OptionRow } from './option-schema.type';
import { OPTION_CHECKS } from './checks/option-checks.constants';
import { ROLL_WORD } from './schema.constants';

const isRollWord = (value: unknown): boolean => typeof value === 'string' && ROLL_WORD.test(value);

const checkOptionValue = (row: OptionRow, value: unknown, allowRoll: boolean): CheckResult => {
  if (!isRollWord(value)) return OPTION_CHECKS[row.type](row, value);
  const own = row.type === 'choice' ? row.choices?.find((choice) => ROLL_WORD.test(choice.value)) : undefined;
  if (own !== undefined) return { ok: true, value: own.id };
  const rollable = row.type !== 'text' && row.type !== 'dict';
  if (allowRoll && rollable) return { ok: true, value: 'random' };
  if (rollable) {
    return {
      ok: false,
      code: 'bad-value',
      message: `${row.key}: "random" is a roll for Archipelago to decide, which a player file from a client does not use. Give a fixed value, or set allowRoll.`,
    };
  }
  return OPTION_CHECKS[row.type](row, value);
};

export { checkOptionValue };
