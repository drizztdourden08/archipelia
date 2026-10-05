/* @layer renderer-app @kind hook */
import type { ServerEntry } from '@archipelia/model';
import type { ServerTestResult } from '@archipelia/hosts';
import { useCallback, useMemo, useState } from 'react';
import type { SecretInputs } from '../ServerManager.type';
import { EMPTY_INPUTS } from '../ServerManager.constants';
import { draftProblems } from './draft-problems';
import { serverDirty } from './server-dirty';
import { useDraftErrors } from './useDraftErrors';

const useServerDraft = (servers: readonly ServerEntry[], onPick: () => void) => {
  const [draft, setDraft] = useState<ServerEntry | null>(null);
  const [inputs, setInputs] = useState<SecretInputs>(EMPTY_INPUTS);
  const [test, setTest] = useState<ServerTestResult | null>(null);
  const problems = useMemo(() => (draft ? draftProblems(draft, inputs) : []), [draft, inputs]);
  const { attempt, errors, reset, touch } = useDraftErrors(problems);
  const id = draft?.id;
  const saved = useMemo(() => (id ? servers.find((entry) => entry.id === id) : undefined), [servers, id]);
  const dirty = serverDirty(draft, saved, inputs);

  const select = useCallback((entry: ServerEntry | null) => {
    setDraft(entry);
    setInputs(EMPTY_INPUTS);
    setTest(entry?.lastTest ?? null);
    reset();
    onPick();
  }, [onPick, reset]);
  const discard = useCallback(() => select(saved ?? null), [saved, select]);

  return { attempt, dirty, discard, draft, errors, inputs, problems, select, setDraft, setInputs, setTest, test, touch };
};

export { useServerDraft };
