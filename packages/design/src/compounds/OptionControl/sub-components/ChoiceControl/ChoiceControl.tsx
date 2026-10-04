/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { Select } from '@drizztdourden08/tessera/primitives';
import type { OptionControlProps } from '../../OptionControl.type';
import { choiceOptions } from '../../behavior/choice-options';
import { SEARCH_FROM } from './ChoiceControl.constants';

const ChoiceControl = ({ def, value, onChange, disabled, labelId }: OptionControlProps) => {
  const options = useMemo(() => choiceOptions(def), [def]);
  const chosen = options.find((option) => option.value === String(value))?.label ?? 'none';
  return (
    <Select
      value={String(value)}
      options={options}
      aria-label={labelId ? undefined : `${def.displayName}: ${chosen}`}
      aria-labelledby={labelId}
      onChange={onChange}
      disabled={disabled}
      searchable={options.length >= SEARCH_FROM}
      placeholder="Pick a value"
    />
  );
};

export { ChoiceControl };
