/* @layer renderer-app @kind component */
import { useCallback, useMemo, useState } from 'react';
import { Select, Stack } from '@drizztdourden08/tessera/primitives';
import { CUSTOM_NUMBER } from '../../mapping/choice-options.constants';
import { namedOptions } from '../../mapping/named-options';
import { namedPick } from '../../values/named-pick';
import { namedSelection } from '../../values/named-selection';
import { numberShown } from '../../values/number-shown';
import type { OptionControlProps } from '../OptionControl.type';
import { RangeControl } from './RangeControl';

const NamedRangeControl = ({ def, value, onChange, disabled }: OptionControlProps) => {
  const [customMode, setCustomMode] = useState(false);
  const options = useMemo(() => namedOptions(def), [def]);
  const selection = customMode && typeof value === 'number' ? CUSTOM_NUMBER : namedSelection(def, value);
  const handlePick = useCallback((pick: string) => {
    setCustomMode(pick === CUSTOM_NUMBER);
    onChange(namedPick(def, pick, value));
  }, [def, value, onChange]);
  return (
    <Stack gap="xs">
      <Select value={selection} options={options} onChange={handlePick} disabled={disabled} />
      {selection === CUSTOM_NUMBER && (
        <RangeControl def={def} value={numberShown(def, value)} onChange={onChange} disabled={disabled} />
      )}
    </Stack>
  );
};

export { NamedRangeControl };
