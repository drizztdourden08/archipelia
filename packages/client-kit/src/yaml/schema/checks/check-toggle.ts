/* @layer client-kit @kind logic */
import type { OptionCheck } from './check.type';
import { describeValue } from './describe-value';

const checkToggle: OptionCheck = ({ key }, value) =>
  typeof value === 'boolean'
    ? { ok: true, value }
    : { ok: false, code: 'wrong-type', message: `${key}: expected true or false, got ${describeValue(value)}.` };

export { checkToggle };
