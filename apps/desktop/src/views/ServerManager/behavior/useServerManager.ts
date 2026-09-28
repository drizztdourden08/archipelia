/* @layer renderer-app @kind hook */
import type { ServerEntry } from '@archipelia/model';
import { secretsApi } from '@drizztdourden08/brock-secrets/renderer';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SecretInputs } from '../ServerManager.type';
import { passwordSecret } from './password-secret';
import { passphraseSecret } from './passphrase-secret';
import { EMPTY_INPUTS } from '../ServerManager.constants';
import type { ServerTestResult } from '../../../ipc/contract.type';
import { archipeliaApi } from '../../../ipc/archipelia-api';
import { newServerEntry } from './new-server-entry';
import { draftProblems } from './draft-problems';
import { withSecretRefs } from './with-secret-refs';

const storeSecrets = async (entry: ServerEntry, inputs: SecretInputs) => {
  const secrets = secretsApi();
  if (!secrets) throw new Error('the vault is not available');
  if (inputs.password) await secrets.set(passwordSecret(entry.id), inputs.password, `SSH password for ${entry.label}`);
  if (inputs.passphrase) await secrets.set(passphraseSecret(entry.id), inputs.passphrase, `Key passphrase for ${entry.label}`);
};

const useServerManager = () => {
  const [servers, setServers] = useState<ServerEntry[]>([]);
  const [draft, setDraft] = useState<ServerEntry | null>(null);
  const [inputs, setInputs] = useState<SecretInputs>(EMPTY_INPUTS);
  const [test, setTest] = useState<ServerTestResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => setServers(await archipeliaApi().serversList()), []);
  useEffect(() => { void load(); }, [load]);

  const guard = useCallback(async (work: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await work();
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }, [load]);

  const select = useCallback((entry: ServerEntry) => { setDraft(entry); setInputs(EMPTY_INPUTS); setTest(entry.lastTest ?? null); }, []);
  const create = useCallback(() => select(newServerEntry()), [select]);
  const problems = useMemo(() => (draft ? draftProblems(draft, inputs) : []), [draft, inputs]);

  const save = useCallback(() => guard(async () => {
    if (!draft || problems.length) return;
    const saved = draft.id ? draft : await archipeliaApi().serversSave(draft);
    await storeSecrets(saved, inputs);
    setDraft(await archipeliaApi().serversSave(withSecretRefs({ ...draft, id: saved.id }, inputs)));
    setInputs(EMPTY_INPUTS);
  }), [draft, guard, inputs, problems]);

  const runTest = useCallback(() => guard(async () => { if (draft?.id) setTest(await archipeliaApi().serversTest(draft.id)); }), [draft, guard]);
  const trust = useCallback((sha: string) => guard(async () => {
    if (!draft?.id) return;
    setDraft(await archipeliaApi().serversTrustKey(draft.id, sha));
    setTest(await archipeliaApi().serversTest(draft.id));
  }), [draft, guard]);
  const remove = useCallback(() => guard(async () => {
    if (!draft?.id) return;
    await archipeliaApi().serversRemove(draft.id);
    const vault = secretsApi();
    if (vault) await Promise.all([passwordSecret(draft.id), passphraseSecret(draft.id)].map((name) => vault.delete(name)));
    setDraft(null);
  }), [draft, guard]);

  return { busy, create, draft, error, inputs, problems, remove, runTest, save, select, servers, setDraft, setInputs, test, trust };
};

export { useServerManager };
