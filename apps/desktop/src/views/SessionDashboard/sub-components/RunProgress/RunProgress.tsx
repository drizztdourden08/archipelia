/* @layer renderer-app @kind component */
import { TaskProgress } from '@drizztdourden08/tessera/composites';
import type { RunProgressProps } from './RunProgress.type';

const RunProgress = ({ job }: RunProgressProps) => {
  if (job?.state !== 'running' && job?.state !== 'failed') return null;
  return (
    <TaskProgress
      state={job.state}
      label={job.title}
      percent={Math.round(job.progress * 100)}
      line={job.line}
      error={job.error}
    />
  );
};

export { RunProgress };
