/* @layer renderer-app @kind component */
import type { OptionControlProps } from './OptionControl.type';
import { CONTROLS } from './OptionControl.constants';
import { controlKindOf } from './behavior/control-kind';

const OptionControl = (props: OptionControlProps) => {
  const { def, value } = props;
  const Control = CONTROLS[controlKindOf(def, value)];
  return <Control {...props} />;
};

export { OptionControl };
