/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SelectOption } from '@drizztdourden08/tessera/primitives';
import type { ServerEntry } from '@archipelia/model';
import { appApi } from '../../../ipc/app-api';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import { logFailure } from '../../../hooks/log-failure';
import { FAILURE } from '../SessionBuilder.constants';

const useBuilderData = () => {
  const { installed, presets, templates, loadInstalled, loadPresets, loadTemplates, createPreset, saveTemplate } = useLibraryStore();
  const [servers, setServers] = useState<ServerEntry[]>([]);
  const [dataFailed, setDataFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setDataFailed(false);
    const fail = (err: unknown) => {
      logFailure(FAILURE.data, err);
      setDataFailed(true);
    };
    loadPresets().catch(fail);
    loadTemplates().catch(fail);
    loadInstalled().catch(fail);
    appApi().serversList().then(setServers, fail);
  }, [attempt]);

  const reloadData = useCallback(() => setAttempt((count) => count + 1), []);
  const serverOptions = useMemo<SelectOption[]>(
    () => servers.map((server) => ({ value: server.id, label: server.label, description: `${server.host}:${server.gamePort}` })),
    [servers],
  );

  return { createPreset, dataFailed, installed, presets, reloadData, saveTemplate, serverOptions, servers, templates };
};

export { useBuilderData };
