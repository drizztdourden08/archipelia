/* @layer renderer-app @kind component */
import { Text } from '@drizztdourden08/tessera/primitives';
import { failureText } from '../../behavior/failure-text';
import { retryOf } from '../../behavior/retry-of';
import { STEP_TEXT } from '../../behavior/step-text.constants';
import { useStartOnMount } from '../../behavior/useStartOnMount';
import type { StepBodyProps } from '../../PackageSourceDialog.type';
import { RouteFailure } from '../RouteFailure';
import { SourceBusy } from '../SourceBusy';

const FetchStep = (props: StepBodyProps) => {
  const { dialog, wizard, view } = props;
  const wheel = wizard.current.id === 'fetch-wheel';
  const start = retryOf(dialog, wizard.values, view);
  useStartOnMount(dialog.finish.kind === 'idle', () => start?.());
  const problem = failureText(dialog.finish);
  if (problem) return <RouteFailure {...props} message={problem} />;
  if (dialog.finish.kind === 'done') return <Text>{STEP_TEXT.checkOk}</Text>;
  return <SourceBusy text={wheel ? STEP_TEXT.fetchBusyWheel : STEP_TEXT.fetchBusyPypi} />;
};

export { FetchStep };
