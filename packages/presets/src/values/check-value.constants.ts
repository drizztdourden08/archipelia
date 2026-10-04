/* @layer core @kind config */
import { isStringList } from '@archipelia/model';
import type { OptionKind } from '@archipelia/model';
import type { Check } from './check-value.type';
import { checkRange } from './check-range';
import { checkKeys } from './check-keys';
import { isCountMap } from './is-count-map';
import { isMap } from './is-map';

const CHECKS: Record<OptionKind, Check> = {
  toggle: (_def, value) => (typeof value === 'boolean' ? undefined : 'on or off'),
  choice: (def, value) => (def.choices?.some((c) => c.value === value) ? undefined : 'one of the listed choices'),
  range: checkRange,
  'named-range': checkRange,
  text: (_def, value) => (typeof value === 'string' ? undefined : 'text'),
  set: (def, value) => (isStringList(value) ? checkKeys(def, value) : 'a list of names'),
  list: (_def, value) => (Array.isArray(value) ? undefined : 'a list'),
  counter: (def, value) => (isCountMap(value) ? checkKeys(def, Object.keys(value)) : 'names with counts'),
  dict: (def, value) => (isMap(value) ? checkKeys(def, Object.keys(value)) : 'a table of names'),
};

export { CHECKS };
