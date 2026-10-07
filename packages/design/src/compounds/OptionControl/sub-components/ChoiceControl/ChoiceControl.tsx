/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { Select } from '@drizztdourden08/tessera/primitives';
import type { OptionControlProps } from '../../OptionControl.type';
import { choiceOptions } from '../../behavior/choice-options';
import { SEARCH_FROM } from './ChoiceControl.constants';

const ChoiceControl = ({ def, value, onChange, disabled }: OptionControlProps) => {
  const options = useMemo(() => choiceOptions(def), [def]);
  return (
    <Select
      value={String(value)}
      options={options}
      onChange={onChange}
      disabled={disabled}
      searchable={options.length >= SEARCH_FROM}
      placeholder="Pick a value"
    />
  );
};

export { ChoiceControl };
