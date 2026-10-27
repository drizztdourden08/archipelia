/* @layer renderer-app @kind component */
import { Text } from '@drizztdourden08/tessera/primitives';
import { STEP_TEXT } from '../../behavior/step-text.constants';
import type { StepBodyProps } from '../../PackageSourceDialog.type';
import { BuildRunning } from '../BuildRunning';
import { FailurePanel } from '../FailurePanel';

const ToolRunning = ({ dialog, wizard, view }: StepBodyProps) => {
  const { stage } = view;
  if (stage?.kind === 'failed') {
    const { build } = stage;
    return <FailurePanel message={stage.message} log={stage.log} onRetry={build ? () => dialog.onBuildStart(build) : undefined} />;
  }
  if (stage?.kind !== 'building') return <Text>{STEP_TEXT.toolDone}</Text>;
  const cancel = () => {
    dialog.onBuildCancel();
    wizard.goTo('tools', { force: true });
  };
  return <BuildRunning text={STEP_TEXT.buildBusy(dialog.module)} buildLog={dialog.buildLog} onCancel={dialog.finish.kind === 'idle' ? cancel : undefined} />;
};

export { ToolRunning };
