/* @layer core @kind logic */
import type { OptionValue } from '@archipelia/model';

const isStringList = (value: OptionValue): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

export { isStringList };
