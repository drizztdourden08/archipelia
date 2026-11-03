/* @layer renderer-app @kind logic */
import type { OptionDef } from '@archipelia/model';
import type { RowControl } from './option-layout.type';
import { SLIDER_MAX_SPAN } from '../GameOptionsPanel.constants';

const rangeControl = (def: OptionDef): RowControl => {
  const span = def.range ? def.range.max - def.range.min : Number.POSITIVE_INFINITY;
  return span <= SLIDER_MAX_SPAN ? 'slider' : 'number';
};

export { rangeControl };
