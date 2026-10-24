/* @layer client-kit @kind logic */
import type { OptionCheck } from './check.type';
import { describeValue } from './describe-value';

const checkText: OptionCheck = ({ key }, value) =>
  typeof value === 'string'
    ? { ok: true, value }
    : { ok: false, code: 'wrong-type', message: `${key}: expected a text, got ${describeValue(value)}.` };

export { checkText };
