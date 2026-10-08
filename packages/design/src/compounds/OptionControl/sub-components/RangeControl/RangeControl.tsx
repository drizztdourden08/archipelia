/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { NumberInput, Slider } from '@drizztdourden08/tessera/primitives';
import type { OptionControlProps } from '../../OptionControl.type';
import { numberValue } from '../../behavior/number-value';

const RangeControl = ({ def, value, onChange, disabled }: OptionControlProps) => {
  const handleChange = useCallback((raw: number) => {
    const next = numberValue(raw);
    if (next !== undefined) onChange(next);
  }, [onChange]);
  const current = typeof value === 'number' ? value : (def.range?.min ?? 0);
  if (!def.range) return <NumberInput value={current} onChange={handleChange} disabled={disabled} />;
  return (
    <Slider
      value={current}
      min={def.range.min}
      max={def.range.max}
      step={1}
      input
      onChange={handleChange}
      disabled={disabled}
    />
  );
};

export { RangeControl };
