/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { confirmAction, useKeyedGuard, useNavigation } from '@drizztdourden08/brock-react';
import { secretsApi } from '@drizztdourden08/brock-secrets/renderer';
import type { ServerEntry, SessionTemplate } from '@archipelia/model';
import { appApi } from '../../../ipc/app-api';
import { CREATE_PARAM } from '../../../hooks/app-navigation.constants';
import { useAppNavigation } from '../../../hooks/useAppNavigation';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import { useRunsStore } from '../../../stores/useRunsStore';
import { duplicateTemplate, newTemplate, passwordNameOf, useHostingDefaults } from '../../SessionBuilder';
import { matchesRun } from './matches-run';
import { matchesTemplate } from './matches-template';
import { useTemplateEntries } from './useTemplateEntries';

const useSessionsLibrary = () => {
  const { templates, loadTemplates, saveTemplate, removeTemplate } = useLibraryStore();
  const runs = useRunsStore((state) => state.runs);
  const loadRuns = useRunsStore((state) => state.load);
  const removeRun = useRunsStore((state) => state.remove);
  const { openSession } = useAppNavigation();
  const [editing, setEditing] = useState<SessionTemplate | null>(null);
  const [servers, setServers] = useState<ServerEntry[]>([]);
  const [query, setQuery] = useState('');
  const { guard, isBusy, lastError: error } = useKeyedGuard();

  useEffect(() => {
    void guard('load', async () => {
      await Promise.all([loadTemplates(), loadRuns()]);
      setServers(await appApi().serversList());
    });
  }, [guard, loadRuns, loadTemplates]);

  useTemplateEntries(templates, servers);

  const byId = useCallback((id: string) => templates.find((template) => template.id === id), [templates]);

  const hosting = useHostingDefaults();
  const createNew = useCallback(() => setEditing(newTemplate(undefined, hosting)), [hosting]);
  const createAsked = useNavigation().params[CREATE_PARAM];
  useEffect(() => { if (createAsked !== undefined) createNew(); }, [createAsked]);
  const edit = useCallback((id: string) => setEditing(byId(id) ?? null), [byId]);
  const closeBuilder = useCallback(() => setEditing(null), []);

  const duplicate = useCallback((id: string) => {
    const template = byId(id);
    if (template) void guard(id, () => saveTemplate(duplicateTemplate(template, templates.map((entry) => entry.name))));
  }, [byId, guard, saveTemplate, templates]);

  const deleteTemplate = useCallback((id: string) => {
    const template = byId(id);
    if (!template) return;
    const message = `Delete ${template.name}? Its runs stay in the history.`;
    void confirmAction({ title: 'Delete template', message, confirmLabel: 'Delete', variant: 'danger' }).then((confirmed) => {
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
    const message = `Delete the ${run?.snapshot.name ?? ''} run and its output files?`;
    void confirmAction({ title: 'Delete run', message, confirmLabel: 'Delete', variant: 'danger' }).then((confirmed) => {
      if (confirmed) void guard(id, () => removeRun(id));
    });
  }, [guard, removeRun, runs]);

  const visibleTemplates = useMemo(() => templates.filter((template) => matchesTemplate(template, query)), [templates, query]);
  const visibleRuns = useMemo(() => runs.filter((run) => matchesRun(run, query)), [runs, query]);

  return {
    byId, closeBuilder, createNew, deleteRun, deleteTemplate, duplicate, edit, editing, error, isBusy, openRun, query,
    runs, servers, setEditing, setQuery, templates, visibleRuns, visibleTemplates,
  };
};

export { useSessionsLibrary };
