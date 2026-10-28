/* @layer renderer-app @kind logic */
import { confirmAction } from '@drizztdourden08/brock-react';
import type { InstallRequest } from '@archipelia/catalog';
import type { GameRow } from '../GameStore.type';
import { TRUST_ASK } from '../GameStore.constants';

const trustConsent = async (row: GameRow | undefined, request: InstallRequest): Promise<InstallRequest | undefined> => {
  const found = row?.entry.discovered;
  if (!row || !found || request.kind !== 'index' || row.installed?.origin?.repoId === found.repoId) return request;
  const accepted = await confirmAction({
    title: TRUST_ASK.title(row.entry.displayName),
    message: TRUST_ASK.message,
    confirmLabel: TRUST_ASK.confirm,
    cancelLabel: TRUST_ASK.cancel,
    facts: [
      { label: 'Repository', value: found.repo },
      { label: 'Published by', value: found.owner },
      { label: 'Stars', value: String(found.stars) },
    ],
  });
  return accepted ? { ...request, acceptRepoId: found.repoId } : undefined;
};

export { trustConsent };
