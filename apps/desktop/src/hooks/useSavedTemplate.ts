/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { useLibraryStore } from '../stores/useLibraryStore';
import { logFailure } from './log-failure';
import { SESSION_FAILED } from './lobby-hooks.constants';

const useSavedTemplate = (templateId: string | undefined) => {
  const templates = useLibraryStore((state) => state.templates);
  const loadTemplates = useLibraryStore((state) => state.loadTemplates);
  const [loaded, setLoaded] = useState(templateId === undefined);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (templateId === undefined) return;
    setFailed(false);
    loadTemplates().then(() => setLoaded(true), (err: unknown) => {
      logFailure(SESSION_FAILED.template, err);
      setFailed(true);
    });
  }, [loadTemplates, templateId, attempt]);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);
  const template = templates.find((entry) => entry.id === templateId) ?? null;
  return { failed, template, loaded, retry };
};

export { useSavedTemplate };
