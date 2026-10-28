/* @layer renderer-app @kind hook */
import { useEffect, useMemo } from 'react';
import { jobs } from '@drizztdourden08/brock-react';
import { runJobId } from '@archipelia/model';
import { findLaunchedRun } from '../runs/find-launched-run';
import { useRunLaunchStore } from '../stores/useRunLaunchStore';
import { useRunsStore } from '../stores/useRunsStore';

const useLaunchWatcher = (): void => {
  const runs = useRunsStore((state) => state.runs);
  const launch = useRunLaunchStore((state) => state.launch);
  const begin = useRunLaunchStore((state) => state.begin);
  const launched = useMemo(() => (launch ? findLaunchedRun(runs, launch) : undefined), [runs, launch]);
  const launchedId = launched?.id;
  const status = launched?.status;

  useEffect(() => { if (launchedId) jobs.open(runJobId(launchedId)); }, [launchedId]);

  useEffect(() => {
    if (!launchedId || (status !== 'hosting' && status !== 'failed')) return;
    begin(null);
    if (status === 'hosting') jobs.dismiss(runJobId(launchedId));
  }, [begin, launchedId, status]);
};

export { useLaunchWatcher };
