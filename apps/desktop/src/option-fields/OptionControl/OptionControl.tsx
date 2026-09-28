/* @layer renderer-app @kind component */
import type { OptionControlProps } from './OptionControl.type';
import { CONTROLS } from './OptionControl.constants';
import { controlKindOf } from '../mapping/control-kind';
import './OptionControl.css';

const OptionControl = (props: OptionControlProps) => {
  const { def, value } = props;
  const Control = CONTROLS[controlKindOf(def, value)];
  return <Control {...props} />;
};

export { OptionControl };
