/* @layer renderer-app @kind hook */
import { usePlatform } from '@drizztdourden08/brock-react';
import { useCallback } from 'react';
import type { InstallRequest } from '@archipelia/catalog';
import { failWith } from '../../../hooks/fail-with';
import { appApi } from '../../../ipc/app-api';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import { APWORLD, FAILURE } from '../GameStore.constants';
import type { GameRow } from '../GameStore.type';
import { consentedRequest } from './consented-request';
import { failOnWorld } from './fail-on-world';
import { toastInstalled } from './toast-installed';
import { trustConsent } from './trust-consent';
import { useConsent } from './useConsent';
import { useInstallNeeds } from './useInstallNeeds';
import type { InstallActionsParams } from './useInstallActions.type';

const useInstallActions = ({ guard, rows }: InstallActionsParams) => {
  const { install } = useLibraryStore();
  const { filePicker } = usePlatform();
  const consent = useConsent();
  const { ask } = consent;
  const { needOf, track } = useInstallNeeds();

  const installConsented = useCallback(async (request: InstallRequest, title: string, row?: GameRow): Promise<boolean> => {
    const trusted = await trustConsent(row, request);
    if (!trusted) return false;
    const ready = await consentedRequest({ request: trusted, title, preview: (asked) => appApi().gamesPackages(asked), ask });
    if (!ready) return false;
    toastInstalled(await install(ready));
    return true;
  }, [ask, install]);

  const installWorld = useCallback((request: InstallRequest, key: string) => {
    const row = rows.find((candidate) => candidate.entry.apworld === key);
    return guard(key, failOnWorld(FAILURE.install, track(key, () => installConsented(request, row?.entry.displayName ?? key, row))));
  }, [guard, rows, installConsented, track]);

  const addFromFile = useCallback(() => guard('file', failWith(FAILURE.file, async () => {
    const picked = await filePicker.pickFile({ extensions: APWORLD });
    if (picked) await installConsented({ kind: 'file', fileName: picked.name, bytes: picked.bytes }, picked.name);
  })), [guard, filePicker, installConsented]);

  return { addFromFile, consent, installWorld, needOf };
};

export { useInstallActions };
