/* @layer client-kit @kind logic */
import type { OptionCheck } from './check.type';
import { describeValue } from './describe-value';

const checkRange: OptionCheck = ({ key, range }, value) => {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    return { ok: false, code: 'wrong-type', message: `${key}: expected a whole number, got ${describeValue(value)}.` };
  }
  const { min, max } = range ?? { min: value, max: value };
  if (value < min || value > max) {
    return { ok: false, code: 'out-of-range', message: `${key}: ${value} is outside ${min} to ${max}.` };
  }
  return { ok: true, value };
};

export { checkRange };
