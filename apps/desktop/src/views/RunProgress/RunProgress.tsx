/* @layer renderer-app @kind component */
import { Button } from '@drizztdourden08/tessera/primitives';
import { DialogShell } from '@drizztdourden08/tessera/composites';
import type { RunLaunch, RunProgressProps } from './RunProgress.type';
import { useRunProgress } from './behavior/useRunProgress';
import { RunProgressPanel } from '../../compounds/RunProgressPanel';
import { LOG_EMPTY } from './RunProgress.constants';

const titleOf = (launch: RunLaunch | null, failed: boolean) => {
  if (!launch) return '';
  return failed ? `Run failed: ${launch.name}` : `Running ${launch.name}`;
};

const RunProgress = ({ launch, onClose }: RunProgressProps) => {
  const run = useRunProgress(launch, onClose);
  const actions = (
    <>
      <Button variant="tertiary" onClick={run.toggleLog}>{run.showLog ? 'Hide log' : 'Show log'}</Button>
      {run.working && <Button variant="secondary" onClick={run.cancel}>Cancel</Button>}
      <Button variant={run.working ? 'secondary' : 'primary'} onClick={onClose}>{run.working ? 'Hide' : 'Close'}</Button>
    </>
  );
  return (
    <DialogShell open={launch !== null} onClose={onClose} title={titleOf(launch, run.failed)} actions={actions}>
      <RunProgressPanel
        percent={run.percent}
        line={run.line}
        steps={run.steps}
        failed={run.failed}
        error={run.error}
        seed={run.seed}
        logRows={run.logRows}
        showLog={run.logVisible}
        logEmpty={LOG_EMPTY}
      />
    </DialogShell>
  );
};

export { RunProgress };
