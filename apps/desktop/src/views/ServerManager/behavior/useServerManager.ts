/* @layer renderer-app @kind hook */
import type { ServerEntry } from '@archipelia/model';
import { useCallback, useEffect, useState } from 'react';
import { useKeyedGuard } from '@drizztdourden08/brock-react';
import type { FailureKey } from '../ServerManager.type';
import { EMPTY_INPUTS, FAILURE, OTHER_FAILURES } from '../ServerManager.constants';
import { failWith } from '../../../hooks/fail-with';
import { appApi } from '../../../ipc/app-api';
import { rowId } from './row-id';
import { saveState } from './save-state';
import { storeSecrets } from './store-secrets';
import { useServerChecks } from './useServerChecks';
import { useServerDraft } from './useServerDraft';
import { useServerEntries } from './useServerEntries';
import { useServerRows } from './useServerRows';
import { withSecretRefs } from './with-secret-refs';

const useServerManager = () => {
  const [servers, setServers] = useState<ServerEntry[]>([]);
  const [savedDraft, setSavedDraft] = useState<ServerEntry | null>(null);
  const { guard: keyed, isBusy, clearError, errorOf } = useKeyedGuard();

  useServerEntries(servers);

  const load = useCallback(async () => setServers(await appApi().serversList()), []);
  useEffect(() => { void load(); }, [load]);

  const guard = useCallback(<T,>(key: FailureKey, work: () => Promise<T>) => {
    clearError();
    return keyed(key, failWith(FAILURE[key], async () => {
      const result = await work();
      await load();
      return result;
    }));
  }, [clearError, keyed, load]);

  const onPick = useCallback(() => clearError(), [clearError]);
  const editor = useServerDraft(servers, onPick);
  const { attempt, dirty, draft, inputs, problems, setDraft, setInputs } = editor;
  const rows = useServerRows({ servers, editor, guard });
  const checks = useServerChecks({ draft, guard, setDraft, setTest: editor.setTest });

  const save = useCallback(async (): Promise<boolean> => {
    attempt();
    if (!draft || problems.length) return false;
    const done = await guard('save', async () => {
      const first = draft.id ? draft : await appApi().serversSave(draft);
      await storeSecrets(first, inputs);
      const stored = await appApi().serversSave(withSecretRefs({ ...draft, id: first.id }, inputs));
      setDraft(stored);
      setSavedDraft(stored);
      setInputs(EMPTY_INPUTS);
      return true;
    });
    return done === true;
  }, [attempt, draft, guard, inputs, problems, setDraft, setInputs]);

  const failed = errorOf('save');
  const saveBar = {
    state: saveState({ saving: isBusy('save'), failed: failed !== null, dirty, saved: draft !== null && draft === savedDraft }),
    error: failed ?? undefined,
  };
  const error = OTHER_FAILURES.map(errorOf).find((message) => message !== null) ?? null;

  return { ...editor, ...rows, ...checks, busy: isBusy(), error, save, saveBar, selectedId: draft ? rowId(draft) : null };
};

export { useServerManager };
