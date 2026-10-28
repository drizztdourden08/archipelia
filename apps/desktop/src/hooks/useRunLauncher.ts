/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import { toast } from '@drizztdourden08/brock-react';
import { appApi } from '../ipc/app-api';
import type { LiveTab } from '../live/live.type';
import { launchOf } from '../runs/launch-of';
import { useRunLaunchStore } from '../stores/useRunLaunchStore';
import { logFailure } from './log-failure';

const useRunLauncher = () => {
  const begin = useRunLaunchStore((state) => state.begin);

  const start = useCallback(async (tab: LiveTab, name: string) => {
    begin(launchOf(tab, Date.now()));
    try {
      await appApi().sessionsRunLobby(tab.tabId);
    } catch (err) {
      begin(null);
      const sentence = `${name} did not run. The app log has the cause.`;
      logFailure(sentence, err);
      toast(sentence, { variant: 'danger' });
    }
  }, [begin]);

  return { start };
};

export { useRunLauncher };
