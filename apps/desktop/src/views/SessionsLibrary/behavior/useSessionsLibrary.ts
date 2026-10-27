/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { confirmDelete, useKeyedGuard, usePageSearch } from '@drizztdourden08/brock-react';
import { secretsApi } from '@drizztdourden08/brock-secrets/renderer';
import type { ServerEntry } from '@archipelia/model';
import { appApi } from '../../../ipc/app-api';
import { failWith } from '../../../hooks/fail-with';
import { openHistory } from '../../../hooks/open-history';
import { openSessionEditor } from '../../../hooks/open-session-editor';
import { openSessionLobby } from '../../../hooks/open-session-lobby';
import { useSessionStart } from '../../../hooks/useSessionStart';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import { useRunsStore } from '../../../stores/useRunsStore';
import { duplicateTemplate, passwordNameOf } from '../../SessionBuilder';
import { runCountsOf } from './run-counts-of';
import { matchesTemplate } from './matches-template';
import { FAILURE } from '../SessionsLibrary.constants';

const useSessionsLibrary = () => {
  const { templates, loadTemplates, saveTemplate, removeTemplate } = useLibraryStore();
  const runs = useRunsStore((state) => state.runs);
  const loadRuns = useRunsStore((state) => state.load);
  const [servers, setServers] = useState<ServerEntry[]>([]);
  const query = usePageSearch();
  const { guard, isBusy, errorOf, lastError } = useKeyedGuard();
  const [opened, setOpened] = useState(false);

  const reload = useCallback(() => guard('load', failWith(FAILURE.load, async () => {
    await Promise.all([loadTemplates(), loadRuns()]);
    setServers(await appApi().serversList());
  })), [guard, loadRuns, loadTemplates]);

  useEffect(() => { void reload().finally(() => setOpened(true)); }, [reload]);

  const byId = useCallback((id: string) => templates.find((template) => template.id === id), [templates]);

  const edit = openSessionEditor;

  const startSession = useSessionStart();
  const start = useCallback((id: string) => {
    const template = byId(id);
    if (template) void guard(id, failWith(FAILURE.start, async () => {
      const started = await startSession(template, saveTemplate);
      if (started) openSessionLobby(started.id);
    }));
  }, [byId, guard, saveTemplate, startSession]);

  const duplicate = useCallback((id: string) => {
    const template = byId(id);
    if (template) void guard(id, failWith(FAILURE.duplicate, () => saveTemplate(duplicateTemplate(template, templates.map((entry) => entry.name)))));
  }, [byId, guard, saveTemplate, templates]);

  const deleteTemplate = useCallback((id: string) => {
    const template = byId(id);
    if (!template) return;
    void confirmDelete({ what: template.name, consequence: 'Its runs stay in History.' }).then((confirmed) => {
      if (!confirmed) return;
      void guard(id, failWith(FAILURE.deleteSession, async () => {
        if (template.server.passwordRef === passwordNameOf(id)) await secretsApi()?.delete(passwordNameOf(id));
        await removeTemplate(id);
      }));
    });
  }, [byId, guard, removeTemplate]);

  const history = openHistory;

  const visibleTemplates = useMemo(() => templates.filter((template) => matchesTemplate(template, query)), [templates, query]);
  const runCounts = useMemo(() => runCountsOf(runs), [runs]);

  const loadError = errorOf('load');
  const loading = !opened || isBusy('load');

  return {
    actionError: lastError === loadError ? null : lastError, deleteTemplate, duplicate, edit, history, isBusy, loadError, loading, query,
    reload, runCounts, servers, start, templates, visibleTemplates,
  };
};

export { useSessionsLibrary };
