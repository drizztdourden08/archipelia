/* @layer renderer-app @kind component */
import { useCallback, useMemo } from 'react';
import { Slider } from '@drizztdourden08/tessera/primitives';
import type { OptionControlProps } from '../../OptionControl.type';
import { numberShown } from '../../behavior/number-shown';
import { numberValue } from '../../behavior/number-value';
import { rangeBounds } from '../../behavior/range-bounds';
import { rangeNames } from '../../behavior/range-names';

const NamedRangeControl = ({ def, value, onChange, disabled }: OptionControlProps) => {
  const names = useMemo(() => rangeNames(def), [def]);
  const { min, max } = rangeBounds(def);
  const handleChange = useCallback((raw: number) => {
    const next = numberValue(raw);
    if (next !== undefined) onChange(next);
  }, [onChange]);
  return <Slider value={numberShown(def, value)} onChange={handleChange} labels={names} min={min} max={max} step={1} input disabled={disabled} />;
};

export { NamedRangeControl };
