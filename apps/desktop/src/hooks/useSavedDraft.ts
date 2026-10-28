/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import { useUnsavedChanges } from '@drizztdourden08/brock-react';
import type { SessionTemplate } from '@archipelia/model';
import { useLibraryStore } from '../stores/useLibraryStore';
import { UNSAVED_SESSION } from './lobby-hooks.constants';

const useSavedDraft = (initial: SessionTemplate, pending = false) => {
  const [draft, setDraft] = useState<SessionTemplate>(initial);
  const [base, setBase] = useState<SessionTemplate>(initial);
  const [savedJson, setSavedJson] = useState<string | null>(null);
  const saveTemplate = useLibraryStore((state) => state.saveTemplate);

  const keep = useCallback(async (template: SessionTemplate) => {
    const saved = await saveTemplate(template);
    setDraft(saved);
    setBase(saved);
    setSavedJson(JSON.stringify(saved));
    return saved;
  }, [saveTemplate]);

  const reset = useCallback(() => setDraft(base), [base]);

  const draftJson = JSON.stringify(draft);
  const saved = savedJson !== null && !pending && savedJson === draftJson;
  const dirty = pending || draftJson !== JSON.stringify(base);
  useUnsavedChanges(dirty, UNSAVED_SESSION);
  return { base, draft, setDraft, keep, reset, saved, dirty };
};

export { useSavedDraft };
