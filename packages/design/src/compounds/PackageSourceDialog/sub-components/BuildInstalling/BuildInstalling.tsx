/* @layer renderer-app @kind component */
import { TOOL_NAME, TOOL_TEXT } from '../../PackageSourceDialog.constants';
import type { BuildInstallingProps } from '../../PackageSourceDialog.type';
import { BuildRunning } from '../BuildRunning';

const BuildInstalling = ({ tool, buildLog, onToolCancel }: BuildInstallingProps) => (
  <BuildRunning text={TOOL_TEXT.installing(TOOL_NAME[tool.tool])} buildLog={buildLog} onCancel={onToolCancel} />
);

export { BuildInstalling };
