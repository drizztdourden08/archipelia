/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import type { OptionControlProps } from './OptionControl.type';
import { CONTROLS } from './OptionControl.constants';
import { controlKindOf } from './behavior/control-kind';
import { controlSizeOf } from './behavior/control-size';
import './OptionControl.css';

const OptionControl = (props: OptionControlProps) => {
  const { def, value } = props;
  const kind = controlKindOf(def, value);
  const Control = CONTROLS[kind];
  return (
    <Box className={`option-control option-control--${controlSizeOf(def, kind)}`}>
      <Control {...props} />
    </Box>
  );
};

export { OptionControl };
