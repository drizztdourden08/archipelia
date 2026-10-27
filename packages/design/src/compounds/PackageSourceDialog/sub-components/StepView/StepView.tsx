/* @layer renderer-app @kind component */
import type { StepBodyProps } from '../../PackageSourceDialog.type';
import { STEP_BODY } from './StepView.constants';

const StepView = (props: StepBodyProps) => {
  const Body = STEP_BODY[props.wizard.current.id];
  return Body ? <Body {...props} /> : null;
};

export { StepView };
