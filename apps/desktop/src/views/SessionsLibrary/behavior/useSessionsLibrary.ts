/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { confirmDelete, useKeyedGuard, usePageSearch } from '@drizztdourden08/brock-react';
import { secretsApi } from '@drizztdourden08/brock-secrets/renderer';
import type { ServerEntry } from '@archipelia/model';
import { appApi } from '../../../ipc/app-api';
import { openSessionEditor } from '../../../hooks/open-session-editor';
import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import { useRunsStore } from '../../../stores/useRunsStore';
import { duplicateTemplate, passwordNameOf } from '../../SessionBuilder';
import { matchesRun } from './matches-run';
import { matchesTemplate } from './matches-template';
import { useTemplateEntries } from './useTemplateEntries';

const useSessionsLibrary = () => {
  const { templates, loadTemplates, saveTemplate, removeTemplate } = useLibraryStore();
  const runs = useRunsStore((state) => state.runs);
  const loadRuns = useRunsStore((state) => state.load);
  const removeRun = useRunsStore((state) => state.remove);
  const { openSession } = useAppNavigation();
  const [servers, setServers] = useState<ServerEntry[]>([]);
  const query = usePageSearch();
  const { guard, isBusy, lastError: error } = useKeyedGuard();

  useEffect(() => {
    void guard('load', async () => {
      await Promise.all([loadTemplates(), loadRuns()]);
      setServers(await appApi().serversList());
    });
  }, [guard, loadRuns, loadTemplates]);

  useTemplateEntries(templates, servers);

  const byId = useCallback((id: string) => templates.find((template) => template.id === id), [templates]);

  const edit = openSessionEditor;

  const duplicate = useCallback((id: string) => {
    const template = byId(id);
    if (template) void guard(id, () => saveTemplate(duplicateTemplate(template, templates.map((entry) => entry.name))));
  }, [byId, guard, saveTemplate, templates]);

  const deleteTemplate = useCallback((id: string) => {
    const template = byId(id);
    if (!template) return;
    void confirmDelete({ what: template.name, consequence: 'Its runs stay in Runs.' }).then((confirmed) => {
      if (!confirmed) return;
      void guard(id, async () => {
        if (template.server.passwordRef === passwordNameOf(id)) await secretsApi()?.delete(passwordNameOf(id));
        await removeTemplate(id);
      });
    });
  }, [byId, guard, removeTemplate]);

  const openRun = openSession;

  const deleteRun = useCallback((id: string) => {
    const run = runs.find((entry) => entry.id === id);
    const what = `this run of ${run?.snapshot.name ?? 'the session'}`;
    void confirmDelete({ what, consequence: 'Its output files go with it.' }).then((confirmed) => {
      if (confirmed) void guard(id, () => removeRun(id));
    });
  }, [guard, removeRun, runs]);

  const visibleTemplates = useMemo(() => templates.filter((template) => matchesTemplate(template, query)), [templates, query]);
  const visibleRuns = useMemo(() => runs.filter((run) => matchesRun(run, query)), [runs, query]);

  return {
    byId, deleteRun, deleteTemplate, duplicate, edit, error, isBusy, openRun, query,
    runs, servers, templates, visibleRuns, visibleTemplates,
  };
};

export { useSessionsLibrary };
