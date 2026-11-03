/* @layer client-kit @kind logic */
import type { OptionCheck } from './check.type';
import { checkNameList } from './check-name-list';

const checkSet: OptionCheck = (row, value) => checkNameList(row, value, true);

export { checkSet };
