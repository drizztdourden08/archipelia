/* @layer renderer-app @kind hook */
import { useEffect, useState } from 'react';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import { newTemplate } from './new-template';
import { useHostingDefaults } from './useHostingDefaults';

const useBuilderTemplate = (templateId: string | undefined) => {
  const templates = useLibraryStore((state) => state.templates);
  const loadTemplates = useLibraryStore((state) => state.loadTemplates);
  const hosting = useHostingDefaults();
  const [fresh] = useState(() => (templateId === undefined ? newTemplate(undefined, hosting) : null));
  const [loaded, setLoaded] = useState(templateId === undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (templateId === undefined) return;
    loadTemplates().then(() => setLoaded(true), (err: Error) => setError(err.message));
  }, [loadTemplates, templateId]);

  const initial = fresh ?? templates.find((template) => template.id === templateId) ?? null;
  return { error, initial, missing: loaded && initial === null };
};

export { useBuilderTemplate };
