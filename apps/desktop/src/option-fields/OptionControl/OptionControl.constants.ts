/* @layer renderer-app @kind config */
import type { ComponentType } from 'react';
import type { ControlKind } from '../mapping/control-kind.type';
import type { OptionControlProps } from './OptionControl.type';
import { KitControl } from './sub-components/KitControl';
import { ChoiceControl } from './sub-components/ChoiceControl';
import { RangeControl } from './sub-components/RangeControl';
import { NamedRangeControl } from './sub-components/NamedRangeControl';
import { SetPickerControl } from './sub-components/SetPickerControl';
import { TagsControl } from './sub-components/TagsControl';
import { CounterControl } from './sub-components/CounterControl';
import { JsonControl } from './sub-components/JsonControl';

const CONTROLS: Record<ControlKind, ComponentType<OptionControlProps>> = {
  toggle: KitControl,
  text: KitControl,
  choice: ChoiceControl,
  range: RangeControl,
  'named-range': NamedRangeControl,
  'set-picker': SetPickerControl,
  'set-tags': TagsControl,
  tags: TagsControl,
  counter: CounterControl,
  'json-object': JsonControl,
  'json-list': JsonControl,
};

export { CONTROLS };
