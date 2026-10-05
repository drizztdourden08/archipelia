/* @layer renderer-app @kind component */
import { useCallback, useMemo } from 'react';
import { Combobox } from '@drizztdourden08/tessera/primitives';
import { stringList } from '../../behavior/string-list';
import { tagsValue } from '../../behavior/tags-value';
import type { OptionControlProps } from '../../OptionControl.type';
import { MULTI_PICK_MAX, NO_KEYS } from './SetPickerControl.constants';

const SetPickerControl = ({ def, value, onChange, disabled }: OptionControlProps) => {
  const options = def.validKeys ?? NO_KEYS;
  const selected = useMemo(() => stringList(value), [value]);
  const handleChange = useCallback((next: string[]) => onChange(tagsValue(def.kind, next)), [def.kind, onChange]);
  return <Combobox items={options} min={0} max={Math.max(options.length, MULTI_PICK_MAX)} values={selected} onValuesChange={handleChange} disabled={disabled} />;
};

export { SetPickerControl };
