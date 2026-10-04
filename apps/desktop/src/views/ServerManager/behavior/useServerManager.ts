/* @layer renderer-app @kind hook */
import type { ServerEntry } from '@archipelia/model';
import { secretsApi } from '@drizztdourden08/brock-secrets/renderer';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { confirmDelete, useKeyedGuard } from '@drizztdourden08/brock-react';
import type { SecretInputs } from '../ServerManager.type';
import { passwordSecret } from './password-secret';
import { passphraseSecret } from './passphrase-secret';
import { EMPTY_INPUTS, FAILURE } from '../ServerManager.constants';
import { failWith } from '../../../hooks/fail-with';
import type { ServerTestResult } from '@archipelia/hosts';
import { appApi } from '../../../ipc/app-api';
import { newServerEntry } from './new-server-entry';
import { draftProblems } from './draft-problems';
import { withSecretRefs } from './with-secret-refs';
import { removeServerConfirm } from './remove-server-confirm';
import { toastTest } from './toast-test';
import { useServerEntries } from './useServerEntries';

const storeSecrets = async (entry: ServerEntry, inputs: SecretInputs) => {
  const secrets = secretsApi();
  if (!secrets) throw new Error('the vault is not available');
  if (inputs.password) await secrets.set(passwordSecret(entry.id), inputs.password, `SSH password for ${entry.label}`);
  if (inputs.passphrase) await secrets.set(passphraseSecret(entry.id), inputs.passphrase, `Key passphrase for ${entry.label}`);
};

const removeServer = async (id: string) => {
  await appApi().serversRemove(id);
  const vault = secretsApi();
  if (vault) await Promise.all([passwordSecret(id), passphraseSecret(id)].map((name) => vault.delete(name)));
};

const useServerManager = () => {
  const [servers, setServers] = useState<ServerEntry[]>([]);
  const [draft, setDraft] = useState<ServerEntry | null>(null);
  const [inputs, setInputs] = useState<SecretInputs>(EMPTY_INPUTS);
  const [test, setTest] = useState<ServerTestResult | null>(null);
  const { guard: keyed, isBusy, clearError, lastError } = useKeyedGuard();

  useServerEntries(servers);

  const load = useCallback(async () => setServers(await appApi().serversList()), []);
  useEffect(() => { void load(); }, [load]);

  const guard = useCallback((key: keyof typeof FAILURE, work: () => Promise<void>) => {
    clearError();
    return keyed(key, failWith(FAILURE[key], async () => {
      await work();
      await load();
    }));
  }, [clearError, keyed, load]);

  const select = useCallback((entry: ServerEntry) => { setDraft(entry); setInputs(EMPTY_INPUTS); setTest(entry.lastTest ?? null); }, []);
  const create = useCallback(() => select(newServerEntry()), [select]);
  const problems = useMemo(() => (draft ? draftProblems(draft, inputs) : []), [draft, inputs]);

  const save = useCallback(() => guard('save', async () => {
    if (!draft || problems.length) return;
    const saved = draft.id ? draft : await appApi().serversSave(draft);
    await storeSecrets(saved, inputs);
    setDraft(await appApi().serversSave(withSecretRefs({ ...draft, id: saved.id }, inputs)));
    setInputs(EMPTY_INPUTS);
  }), [draft, guard, inputs, problems]);

  const runTest = useCallback(() => guard('test', async () => {
    if (!draft?.id) return;
    const result = await appApi().serversTest(draft.id);
    setTest(result);
    toastTest(draft.label, result);
  }), [draft, guard]);
  const trust = useCallback((sha: string) => guard('trust', async () => {
    if (!draft?.id) return;
    setDraft(await appApi().serversTrustKey(draft.id, sha));
    setTest(await appApi().serversTest(draft.id));
  }), [draft, guard]);
  const remove = useCallback(() => {
    if (!draft?.id) return;
    const { id } = draft;
    void confirmDelete(removeServerConfirm(draft)).then((confirmed) => {
      if (!confirmed) return;
      void guard('remove', async () => {
        await removeServer(id);
        setDraft(null);
      });
    });
  }, [draft, guard]);

  return { busy: isBusy(), create, draft, error: lastError, inputs, problems, remove, runTest, save, select, servers, setDraft, setInputs, test, trust };
};

export { useServerManager };
