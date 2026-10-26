/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useState } from 'react';
import type { ServerEntry } from '@archipelia/model';
import { appApi } from '../ipc/app-api';
import { useLibraryStore } from '../stores/useLibraryStore';
import { logFailure } from './log-failure';
import { SESSION_FAILED } from './lobby-hooks.constants';

const useLibraryData = () => {
  const { installed, presets, templates, loadInstalled, loadPresets, loadTemplates, createPreset, saveTemplate } = useLibraryStore();
  const [servers, setServers] = useState<ServerEntry[]>([]);
  const [dataFailed, setDataFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setDataFailed(false);
    const fail = (err: unknown) => {
      logFailure(SESSION_FAILED.data, err);
      setDataFailed(true);
    };
    loadPresets().catch(fail);
    loadTemplates().catch(fail);
    loadInstalled().catch(fail);
    appApi().serversList().then(setServers, fail);
  }, [attempt]);

  const reloadData = useCallback(() => setAttempt((count) => count + 1), []);

  return { createPreset, dataFailed, installed, presets, reloadData, saveTemplate, servers, templates };
};

export { useLibraryData };
