/* @layer client-kit @kind logic */
import type { OptionCheck } from './check.type';
import { checkNameList } from './check-name-list';

const checkList: OptionCheck = (row, value) => checkNameList(row, value, false);

export { checkList };
