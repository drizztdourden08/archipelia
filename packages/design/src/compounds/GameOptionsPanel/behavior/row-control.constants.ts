/* @layer renderer-app @kind config */
import { choicesOf } from '@archipelia/model';
import type { OptionDef, OptionKind } from '@archipelia/model';
import type { RowControl } from './option-layout.type';
import { rangeControl } from './range-control';
import { SEGMENT_MAX } from '../GameOptionsPanel.constants';

const CONTROL_OF: Record<OptionKind, (def: OptionDef) => RowControl> = {
  toggle: () => 'toggle',
  choice: (def) => (choicesOf(def).length <= SEGMENT_MAX ? 'segmented' : 'dropdown'),
  range: rangeControl,
  'named-range': (def) => (Object.keys(def.namedValues ?? {}).length ? 'custom' : rangeControl(def)),
  text: () => 'text',
  set: () => 'custom',
  list: () => 'custom',
  counter: () => 'custom',
  dict: () => 'custom',
};

export { CONTROL_OF };
