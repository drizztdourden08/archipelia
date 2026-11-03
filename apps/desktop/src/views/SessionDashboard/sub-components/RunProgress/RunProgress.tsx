/* @layer renderer-app @kind component */
import { jobStepper } from '@drizztdourden08/brock-react';
import { Stepper } from '@drizztdourden08/tessera/primitives';
import type { RunProgressProps } from './RunProgress.type';

const RunProgress = ({ job }: RunProgressProps) => {
  if (job?.state !== 'running' && job?.state !== 'failed') return null;
  return <Stepper {...jobStepper(job)} />;
};

export { RunProgress };
