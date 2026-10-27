/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { jobs, toast } from '@drizztdourden08/brock-react';
import { runJobId } from '@archipelia/model';
import type { SessionTemplate } from '@archipelia/model';
import { appApi } from '../ipc/app-api';
import { findLaunchedRun } from '../runs/find-launched-run';
import { launchOf } from '../runs/launch-of';
import type { RunLaunch } from '../runs/run-launch.type';
import { useLiveStore } from '../stores/useLiveStore';
import { useRunsStore } from '../stores/useRunsStore';
import { logFailure } from './log-failure';

const tabIdOf = async (sessionId: string): Promise<string> => {
  const known = useLiveStore.getState().tabs.find((tab) => tab.sessionId === sessionId);
  const tab = known ?? (await appApi().liveList()).find((entry) => entry.sessionId === sessionId);
  if (!tab) throw new Error(`The session ${sessionId} has no open lobby.`);
  return tab.tabId;
};

const useRunLauncher = () => {
  const runs = useRunsStore((state) => state.runs);
  const [launch, setLaunch] = useState<RunLaunch | null>(null);
  const launched = useMemo(() => (launch ? findLaunchedRun(runs, launch) : undefined), [runs, launch]);
  const launchedId = launched?.id;
  const status = launched?.status;

  useEffect(() => { if (launchedId) jobs.open(runJobId(launchedId)); }, [launchedId]);

  useEffect(() => {
    if (!launchedId || (status !== 'hosting' && status !== 'failed')) return;
    setLaunch(null);
    if (status === 'hosting') jobs.dismiss(runJobId(launchedId));
  }, [launchedId, status]);

  const start = useCallback(async (template: SessionTemplate) => {
    setLaunch(launchOf(template, Date.now()));
    try {
      await appApi().sessionsRunLobby(await tabIdOf(template.id));
    } catch (err) {
      setLaunch(null);
      const sentence = `${template.name} did not run. The app log has the cause.`;
      logFailure(sentence, err);
      toast(sentence, { variant: 'danger' });
    }
  }, []);

  return { start };
};

export { useRunLauncher };
