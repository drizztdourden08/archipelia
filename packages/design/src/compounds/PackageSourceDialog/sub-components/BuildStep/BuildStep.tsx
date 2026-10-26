/* @layer renderer-app @kind component */
import { BUILD_TEXT } from '../../PackageSourceDialog.constants';
import type { BuildStepProps } from '../../PackageSourceDialog.type';
import { BuildConfirm } from '../BuildConfirm';
import { BuildFailed } from '../BuildFailed';
import { BuildMissing } from '../BuildMissing';
import { BuildReady } from '../BuildReady';
import { BuildRunning } from '../BuildRunning';

const BuildStep = ({ module, candidate, plan, stage, buildLog, onBuildCancel, onBuildDownload, onBuildStart, onOpenLink }: BuildStepProps) => {
  switch (stage.kind) {
    case 'confirm':
      return <BuildConfirm repo={candidate.id} short={plan.pin.sha.slice(0, 7)} onBuildDownload={onBuildDownload} />;
    case 'preparing':
      return <BuildRunning text={BUILD_TEXT.preparing} buildLog={buildLog} onBuildCancel={onBuildCancel} />;
    case 'ready':
      return <BuildReady module={module} candidate={candidate} build={stage.build} onBuildStart={onBuildStart} />;
    case 'building':
      return <BuildRunning text={BUILD_TEXT.building(module)} buildLog={buildLog} onBuildCancel={onBuildCancel} />;
    case 'missing':
      return <BuildMissing build={stage.build} missing={stage.missing} log={stage.log} onBuildStart={onBuildStart} onOpenLink={onOpenLink} />;
    case 'failed':
      return <BuildFailed build={stage.build} message={stage.message} log={stage.log} onBuildStart={onBuildStart} />;
  }
};

export { BuildStep };
