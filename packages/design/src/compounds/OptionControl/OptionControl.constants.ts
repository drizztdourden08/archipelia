/* @layer renderer-app @kind config */
import type { ComponentType } from 'react';
import type { ControlKind } from './behavior/control-kind.type';
import type { OptionControlProps } from './OptionControl.type';
import { ToggleControl } from './sub-components/ToggleControl';
import { TextControl } from './sub-components/TextControl';
import { ChoiceControl } from './sub-components/ChoiceControl';
import { RangeControl } from './sub-components/RangeControl';
import { NamedRangeControl } from './sub-components/NamedRangeControl';
import { SetPickerControl } from './sub-components/SetPickerControl';
import { TagsControl } from './sub-components/TagsControl';
import { KeyValueControl } from './sub-components/KeyValueControl';
import { JsonControl } from './sub-components/JsonControl';

const CONTROLS: Record<ControlKind, ComponentType<OptionControlProps>> = {
  toggle: ToggleControl,
  text: TextControl,
  choice: ChoiceControl,
  range: RangeControl,
  'named-range': NamedRangeControl,
  'set-picker': SetPickerControl,
  'set-tags': TagsControl,
  tags: TagsControl,
  counter: KeyValueControl,
  'key-values': KeyValueControl,
  'json-object': JsonControl,
  'json-list': JsonControl,
};

export { CONTROLS };
