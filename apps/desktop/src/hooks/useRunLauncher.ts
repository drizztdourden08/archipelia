/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { jobs, toast } from '@drizztdourden08/brock-react';
import type { SessionTemplate } from '@archipelia/model';
import { runJobId } from '../jobs/run-job-id';
import { findLaunchedRun } from '../runs/find-launched-run';
import type { RunLaunch } from '../runs/run-launch.type';
import { useRunsStore } from '../stores/useRunsStore';
import { useAppNavigation } from './useAppNavigation';

const useRunLauncher = () => {
  const run = useRunsStore((state) => state.run);
  const runs = useRunsStore((state) => state.runs);
  const { openSession } = useAppNavigation();
  const [launch, setLaunch] = useState<RunLaunch | null>(null);
  const launched = useMemo(() => (launch ? findLaunchedRun(runs, launch) : undefined), [runs, launch]);
  const launchedId = launched?.id;
  const status = launched?.status;

  useEffect(() => { if (launchedId) jobs.open(runJobId(launchedId)); }, [launchedId]);

  useEffect(() => {
    if (!launchedId || (status !== 'hosting' && status !== 'failed')) return;
    setLaunch(null);
    if (status !== 'hosting') return;
    jobs.dismiss(runJobId(launchedId));
    openSession(launchedId);
  }, [launchedId, openSession, status]);

  const start = useCallback(async (template: SessionTemplate) => {
    setLaunch({ templateId: template.id, startedAt: Date.now() });
    try {
      await run(template);
    } catch (err) {
      setLaunch(null);
      toast(`${template.name} did not run: ${(err as Error).message}`, { variant: 'danger' });
    }
  }, [run]);

  return { start };
};

export { useRunLauncher };
