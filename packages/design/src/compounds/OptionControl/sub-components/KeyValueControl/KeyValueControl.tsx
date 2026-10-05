/* @layer renderer-app @kind component */
import { useCallback, useMemo } from 'react';
import { KeyValueEditor } from '@drizztdourden08/tessera/composites';
import type { KeyValueEntry } from '@drizztdourden08/tessera/composites';
import type { OptionControlProps } from '../../OptionControl.type';
import { countsOf } from '../../behavior/counts-of';
import { keyValueLook } from '../../behavior/key-value-look';
import { scalarsOf } from '../../behavior/scalars-of';

const KeyValueControl = ({ def, value, onChange, disabled }: OptionControlProps) => {
  const look = useMemo(() => keyValueLook(def, value), [def, value]);
  const entries = useMemo(() => scalarsOf(value), [value]);
  const handleChange = useCallback(
    (next: Record<string, KeyValueEntry>) => onChange(def.kind === 'counter' ? countsOf(next) : next),
    [def.kind, onChange],
  );
  return (
    <KeyValueEditor
      value={entries}
      onChange={handleChange}
      keys={look.keys}
      valueKind={look.valueKind}
      min={look.min}
      newValue={look.newValue}
      disabled={disabled}
    />
  );
};

export { KeyValueControl };
