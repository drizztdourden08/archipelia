/* @layer renderer-app @kind component */
import { Text } from '@drizztdourden08/tessera/primitives';
import { useStartOnMount } from '../../behavior/useStartOnMount';
import { STEP_TEXT } from '../../behavior/step-text.constants';
import type { StepBodyProps } from '../../PackageSourceDialog.type';
import { BuildRunning } from '../BuildRunning';
import { FailurePanel } from '../FailurePanel';

const BuildStep = ({ dialog, wizard, view }: StepBodyProps) => {
  const { stage } = view;
  const start = () => stage?.kind === 'ready' && dialog.onBuildStart(stage.build);
  useStartOnMount(stage?.kind === 'ready', start);
  if (stage?.kind === 'failed') {
    return <FailurePanel message={stage.message} log={stage.log} onRetry={stage.build ? () => stage.build && dialog.onBuildStart(stage.build) : undefined} />;
  }
  if (stage?.kind !== 'ready' && stage?.kind !== 'building') return <Text>{STEP_TEXT.buildStopped}</Text>;
  const cancel = () => {
    dialog.onBuildCancel();
    wizard.goBack();
  };
  return <BuildRunning text={STEP_TEXT.buildBusy(dialog.module)} buildLog={dialog.buildLog} onCancel={dialog.finish.kind === 'idle' ? cancel : undefined} />;
};

export { BuildStep };
