/* @layer renderer-app @kind component */
import { Toggle, useFieldControl } from '@drizztdourden08/tessera/primitives';
import type { OptionControlProps } from '../../OptionControl.type';

const ToggleControl = ({ value, onChange, disabled }: OptionControlProps) => {
  const { labelId } = useFieldControl();
  return <Toggle checked={value === true} onChange={onChange} disabled={disabled} aria-labelledby={labelId} />;
};

export { ToggleControl };
