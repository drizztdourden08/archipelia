/* @layer renderer-app @kind component */
import { useCallback, useMemo } from 'react';
import { SetPicker } from '@drizztdourden08/tessera/primitives';
import { stringList } from '../../behavior/string-list';
import { tagsValue } from '../../behavior/tags-value';
import type { OptionControlProps } from '../../OptionControl.type';
import { NO_KEYS } from './SetPickerControl.constants';

const SetPickerControl = ({ def, value, onChange, disabled }: OptionControlProps) => {
  const selected = useMemo(() => stringList(value), [value]);
  const handleChange = useCallback((next: string[]) => onChange(tagsValue(def.kind, next)), [def.kind, onChange]);
  return <SetPicker options={def.validKeys ?? NO_KEYS} value={selected} onChange={handleChange} disabled={disabled} />;
};

export { SetPickerControl };
