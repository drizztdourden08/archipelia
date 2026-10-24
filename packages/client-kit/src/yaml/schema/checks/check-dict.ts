/* @layer client-kit @kind logic */
import type { OptionCheck } from './check.type';
import { isPlainRecord } from '../../emit/is-plain-record';
import { describeValue } from './describe-value';

const checkDict: OptionCheck = ({ key }, value) =>
  isPlainRecord(value)
    ? { ok: true, value }
    : { ok: false, code: 'wrong-type', message: `${key}: expected an object, got ${describeValue(value)}.` };

export { checkDict };
