/* @layer renderer-app @kind component */
import { Text } from '@drizztdourden08/tessera/primitives';
import { useStartOnMount } from '../../behavior/useStartOnMount';
import { STEP_TEXT } from '../../behavior/step-text.constants';
import { BUILD_TEXT } from '../../PackageSourceDialog.constants';
import type { StepBodyProps } from '../../PackageSourceDialog.type';
import { BuildRunning } from '../BuildRunning';
import { FailurePanel } from '../FailurePanel';

const PrepareStep = ({ dialog, wizard, view }: StepBodyProps) => {
  const { stage } = view;
  useStartOnMount(stage === undefined, dialog.onBuildDownload);
  if (stage?.kind === 'failed') return <FailurePanel message={stage.message} log={stage.log} onRetry={dialog.onBuildDownload} />;
  if (stage && stage.kind !== 'preparing') return <Text>{STEP_TEXT.downloaded}</Text>;
  const cancel = () => {
    dialog.onBuildCancel();
    wizard.goBack();
  };
  return <BuildRunning text={BUILD_TEXT.preparing} buildLog={dialog.buildLog} onCancel={cancel} />;
};

export { PrepareStep };
