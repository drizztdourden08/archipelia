/* @layer renderer-app @kind component */
import { useCallback, useEffect } from 'react';
import { JsonInput } from '@drizztdourden08/tessera/primitives';
import type { JsonProblem } from '@drizztdourden08/tessera/primitives';
import type { OptionValue } from '@archipelia/model';
import type { OptionControlProps } from '../../OptionControl.type';

const JsonControl = ({ def, value, onChange, onProblem, disabled }: OptionControlProps) => {
  const handleChange = useCallback((next: unknown) => onChange(next as OptionValue), [onChange]);
  const handleProblem = useCallback((problem: JsonProblem | null) => onProblem?.(problem?.message ?? null), [onProblem]);
  useEffect(() => () => onProblem?.(null), [onProblem]);
  return (
    <JsonInput
      value={value}
      onChange={handleChange}
      onProblem={handleProblem}
      shape={def.kind === 'dict' ? 'object' : 'array'}
      disabled={disabled}
    />
  );
};

export { JsonControl };
