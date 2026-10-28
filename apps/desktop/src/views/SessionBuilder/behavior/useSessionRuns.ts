/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { useSessionStart } from '../../../hooks/useSessionStart';
import { overridesOfSession } from '../../../live/overrides-of-session';
import { showTab } from '../../../live/show-tab';
import type { LiveTab } from '../../../live/live.type';
import type { SessionRunDeps } from '../SessionBuilder.type';

const useSessionRuns = ({ draft, dirty, commit, keep, discard, guard, tab }: SessionRunDeps) => {
  const startSession = useSessionStart();
  const [started, setStarted] = useState<string | null>(null);
  useEffect(() => { if (started && !dirty) showTab(started); }, [dirty, started]);

  const launch = useCallback((begin: () => Promise<LiveTab | null>, after?: () => void) => {
    void guard('start', async () => {
      const opened = await begin();
      if (!opened) return;
      setStarted(opened.tabId);
      after?.();
    });
  }, [guard]);

  const run = useCallback(() => launch(() => startSession({ template: draft })), [draft, launch, startSession]);
  const saveAndRun = useCallback(() => launch(async () => startSession({ template: await commit(draft), keep })), [commit, draft, keep, launch, startSession]);
  const runOnce = useCallback(() => launch(() => startSession({ template: draft, overrides: overridesOfSession(draft) }), discard), [discard, draft, launch, startSession]);
  const goToTab = useCallback(() => { if (tab) showTab(tab.tabId); }, [tab]);

  return { goToTab, run, runOnce, saveAndRun };
};

export { useSessionRuns };
