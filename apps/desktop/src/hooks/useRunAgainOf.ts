/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import type { Session } from '@archipelia/model';
import { overridesOfRun } from '../live/overrides-of-run';
import { showTab } from '../live/show-tab';
import { savedSessionOf } from '../runs/saved-session-of';
import { useLibraryStore } from '../stores/useLibraryStore';
import { RUN_AGAIN_GONE } from './lobby-hooks.constants';
import { useSessionStart } from './useSessionStart';

const useRunAgainOf = () => {
  const templates = useLibraryStore((state) => state.templates);
  const startSession = useSessionStart();

  return useCallback(async (run: Session): Promise<void> => {
    const saved = savedSessionOf(templates, run);
    if (!saved) throw new Error(RUN_AGAIN_GONE);
    const tab = await startSession({ template: saved, overrides: overridesOfRun(run) });
    if (tab) showTab(tab.tabId);
  }, [startSession, templates]);
};

export { useRunAgainOf };
