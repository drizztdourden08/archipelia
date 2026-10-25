/* @layer renderer-app @kind config */
import type { OptionDef } from '@archipelia/model';
import type { ControlKind } from './control-kind.type';
import type { ControlSize } from './control-size.type';
import { choiceOptions } from './choice-options';

const SHORT_LABEL = 10;

const MEDIUM_LABEL = 22;

const choiceSize = (def: OptionDef): ControlSize => {
  const longest = Math.max(0, ...choiceOptions(def).map((choice) => choice.label.length));
  if (longest <= SHORT_LABEL) return 'sm';
  return longest <= MEDIUM_LABEL ? 'md' : 'lg';
};

const SIZE_OF: Record<ControlKind, (def: OptionDef) => ControlSize> = {
  toggle: () => 'auto',
  choice: choiceSize,
  range: (def) => (def.range ? 'md' : 'xs'),
  'named-range': () => 'md',
  text: () => 'lg',
  'set-picker': () => 'full',
  'set-tags': () => 'full',
  tags: () => 'full',
  counter: () => 'full',
  'key-values': () => 'full',
  'json-object': () => 'full',
  'json-list': () => 'full',
};

export { SIZE_OF };
