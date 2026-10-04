/* @layer renderer-app @kind logic */
import type { OptionValue } from '@archipelia/model';
import type { Counts } from './counter-entries.type';
import { countsOf } from './counts-of';

const addCount = (value: OptionValue, name: string): Counts => {
  const counts = countsOf(value);
  const key = name.trim();
  return !key || key in counts ? counts : { ...counts, [key]: 1 };
};

export { addCount };
