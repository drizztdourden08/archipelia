/* @layer renderer-app @kind logic */
import type { OptionValue } from '@archipelia/model';
import type { Counts } from './counter-entries.type';
import { countsOf } from './counts-of';

const setCount = (value: OptionValue, name: string, count: number): Counts => ({ ...countsOf(value), [name]: count });

export { setCount };
