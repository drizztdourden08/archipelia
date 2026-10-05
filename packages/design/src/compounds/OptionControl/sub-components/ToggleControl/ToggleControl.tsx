/* @layer renderer-app @kind component */
import { Toggle } from '@drizztdourden08/tessera/primitives';
import type { OptionControlProps } from '../../OptionControl.type';

const ToggleControl = ({ value, onChange, disabled }: OptionControlProps) => <Toggle checked={value === true} onChange={onChange} disabled={disabled} />;

export { ToggleControl };
