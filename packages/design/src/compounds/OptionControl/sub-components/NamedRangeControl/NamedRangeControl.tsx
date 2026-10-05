/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { NamedRange } from '@drizztdourden08/tessera/primitives';
import type { OptionControlProps } from '../../OptionControl.type';
import { numberShown } from '../../behavior/number-shown';
import { rangeBounds } from '../../behavior/range-bounds';
import { rangeNames } from '../../behavior/range-names';

const NamedRangeControl = ({ def, value, onChange, disabled }: OptionControlProps) => {
  const names = useMemo(() => rangeNames(def), [def]);
  const { min, max } = rangeBounds(def);
  return <NamedRange value={numberShown(def, value)} onChange={onChange} names={names} min={min} max={max} step={1} disabled={disabled} />;
};

export { NamedRangeControl };
