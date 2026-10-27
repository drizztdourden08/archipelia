/* @layer renderer-app @kind component */
import { useStartOnMount } from '../../behavior/useStartOnMount';
import { TOOL_NAME, TOOL_TEXT } from '../../PackageSourceDialog.constants';
import type { StepBodyProps } from '../../PackageSourceDialog.type';
import { BuildRunning } from '../BuildRunning';
import { ToolMissing } from '../ToolMissing';
import { ToolPaused } from '../ToolPaused';
import { ToolRunning } from '../ToolRunning';

const ToolStep = (props: StepBodyProps) => {
  const { dialog, wizard, view } = props;
  const { stage } = view;
  useStartOnMount(!wizard.values.tooled, () => wizard.update({ tooled: true }));
  if (stage?.kind === 'missing') return <ToolMissing stage={stage} onBuildStart={dialog.onBuildStart} onOpenLink={dialog.onOpenLink} onToolInstall={dialog.onToolInstall} />;
  if (stage?.kind === 'installing') {
    return <BuildRunning text={TOOL_TEXT.installing(TOOL_NAME[stage.tool.tool])} buildLog={dialog.buildLog} onCancel={dialog.onToolCancel} />;
  }
  if (stage?.kind === 'paused') return <ToolPaused build={stage.build} message={stage.message} log={stage.log} onBuildStart={dialog.onBuildStart} />;
  return <ToolRunning {...props} />;
};

export { ToolStep };
