/* @layer renderer-app @kind logic */
import { choicesOf } from '@archipelia/model';
import type { OptionDef, OptionKind } from '@archipelia/model';
import type { RowControl } from './option-layout.type';
import { SEGMENT_MAX, SLIDER_MAX_SPAN } from '../GameOptionsPanel.constants';

const rangeControl = (def: OptionDef): RowControl => {
  const span = def.range ? def.range.max - def.range.min : Number.POSITIVE_INFINITY;
  return span <= SLIDER_MAX_SPAN ? 'slider' : 'number';
};

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

const rowControlOf = (def: OptionDef): RowControl => CONTROL_OF[def.kind](def);

export { rowControlOf };
