/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import type { ChecksOptions } from '../ServerManager.type';
import { appApi } from '../../../ipc/app-api';
import { toastTest } from './toast-test';

const useServerChecks = ({ draft, guard, setDraft, setTest }: ChecksOptions) => {
  const runTest = useCallback(() => guard('test', async () => {
    if (!draft?.id) return;
    const result = await appApi().serversTest(draft.id);
    setTest(result);
    toastTest(draft.label, result);
  }), [draft, guard, setTest]);

  const trust = useCallback((sha: string) => guard('trust', async () => {
    if (!draft?.id) return;
    const { id } = draft;
    const { hostKeySha256 } = await appApi().serversTrustKey(id, sha);
    setDraft((current) => (current?.id === id ? { ...current, hostKeySha256 } : current));
    setTest(await appApi().serversTest(id));
  }), [draft, guard, setDraft, setTest]);

  return { runTest, trust };
};

export { useServerChecks };
