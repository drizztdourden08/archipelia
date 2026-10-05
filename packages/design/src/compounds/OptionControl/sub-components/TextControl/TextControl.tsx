/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { TextInput } from '@drizztdourden08/tessera/primitives';
import type { OptionControlProps } from '../../OptionControl.type';

const TextControl = ({ value, onChange, disabled }: OptionControlProps) => {
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value), [onChange]);
  return <TextInput value={typeof value === 'string' ? value : String(value)} onChange={handleChange} disabled={disabled} />;
};

export { TextControl };
