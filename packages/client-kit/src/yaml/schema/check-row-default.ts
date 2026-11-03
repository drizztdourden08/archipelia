/* @layer client-kit @kind logic */
import type { OptionRow } from './option-schema.type';
import { OPTION_CHECKS } from './checks/option-checks.constants';
import { NAME_LIST_TYPES } from './schema.constants';

const checkRowDefault = (row: OptionRow, problems: string[]): void => {
  if (!NAME_LIST_TYPES.includes(row.type) || row.names === undefined || !('default' in row)) return;
  const result = OPTION_CHECKS[row.type](row, row.default);
  if (!result.ok) problems.push(`default of ${result.message}`);
};

export { checkRowDefault };
