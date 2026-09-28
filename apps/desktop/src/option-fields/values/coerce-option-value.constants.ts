/* @layer renderer-app @kind config */
import type { OptionKind } from '@archipelia/model';
import type { Coerce } from './coerce-option-value.type';
import { toggleOf } from './toggle-of';
import { choiceOf } from './choice-of';
import { rangeOf } from './range-of';
import { isJson } from './is-json';
import { coerceCounts } from './coerce-counts';
import { isLoose } from './is-loose';

const COERCE: Record<OptionKind, Coerce> = {
  toggle: (_def, raw) => toggleOf(raw),
  choice: choiceOf,
  range: rangeOf,
  'named-range': rangeOf,
  text: (_def, raw) => (typeof raw === 'object' ? undefined : String(raw)),
  set: (_def, raw) => (Array.isArray(raw) ? raw.map((item) => String(item)) : undefined),
  list: (_def, raw) => (Array.isArray(raw) && isJson(raw) ? raw : undefined),
  counter: (_def, raw) => coerceCounts(raw),
  dict: (_def, raw) => (isLoose(raw) && isJson(raw) ? raw : undefined),
};

export { COERCE };
