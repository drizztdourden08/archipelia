/* @layer core @kind logic */
import type { OptionValue } from '@archipelia/model';

const isMap = (value: unknown): value is Exclude<OptionValue, string | number | boolean | unknown[]> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export { isMap };
