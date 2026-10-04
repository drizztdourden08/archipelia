/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import { logFailure } from '../../../hooks/log-failure';
import { FAILURE } from '../SessionBuilder.constants';
import { newTemplate } from './new-template';
import { useHostingDefaults } from './useHostingDefaults';

const useBuilderTemplate = (templateId: string | undefined) => {
  const templates = useLibraryStore((state) => state.templates);
  const loadTemplates = useLibraryStore((state) => state.loadTemplates);
  const hosting = useHostingDefaults();
  const [fresh] = useState(() => (templateId === undefined ? newTemplate(undefined, hosting) : null));
  const [loaded, setLoaded] = useState(templateId === undefined);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (templateId === undefined) return;
    setFailed(false);
    loadTemplates().then(() => setLoaded(true), (err: unknown) => {
      logFailure(FAILURE.template, err);
      setFailed(true);
    });
  }, [loadTemplates, templateId, attempt]);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);
  const initial = fresh ?? templates.find((template) => template.id === templateId) ?? null;
  return { failed, initial, missing: loaded && initial === null, retry };
};

export { useBuilderTemplate };
