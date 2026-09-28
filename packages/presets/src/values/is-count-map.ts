/* @layer core @kind logic */
import type { OptionValue } from '@archipelia/model';
import { isMap } from './is-map';

const isCountMap = (value: OptionValue): value is Record<string, number> =>
  isMap(value) && Object.values(value).every((n) => typeof n === 'number');

export { isCountMap };
