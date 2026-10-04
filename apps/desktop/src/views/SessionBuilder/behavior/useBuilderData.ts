/* @layer renderer-app @kind hook */
import { useEffect, useMemo, useState } from 'react';
import type { SelectOption } from '@drizztdourden08/tessera/primitives';
import type { ServerEntry } from '@archipelia/model';
import { appApi } from '../../../ipc/app-api';
import { useLibraryStore } from '../../../stores/useLibraryStore';

const useBuilderData = (onError: (message: string) => void) => {
  const { installed, presets, templates, loadInstalled, loadPresets, loadTemplates, createPreset, saveTemplate } = useLibraryStore();
  const [servers, setServers] = useState<ServerEntry[]>([]);

  useEffect(() => {
    const fail = (err: unknown) => onError((err as Error).message);
    loadPresets().catch(fail);
    loadTemplates().catch(fail);
    loadInstalled().catch(fail);
    appApi().serversList().then(setServers, fail);
  }, []);

  const serverOptions = useMemo<SelectOption[]>(
    () => servers.map((server) => ({ value: server.id, label: server.label, description: `${server.host}:${server.gamePort}` })),
    [servers],
  );

  return { createPreset, installed, presets, saveTemplate, serverOptions, servers, templates };
};

export { useBuilderData };
