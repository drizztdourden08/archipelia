/* @layer renderer-app @kind logic */
import type { OptionValue } from '@archipelia/model';
import type { Counts } from './counter-entries.type';
import { countsOf } from './counts-of';

const removeCount = (value: OptionValue, name: string): Counts =>
  Object.fromEntries(Object.entries(countsOf(value)).filter(([key]) => key !== name));

export { removeCount };
