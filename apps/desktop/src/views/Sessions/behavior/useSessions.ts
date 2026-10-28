/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { confirmAction, confirmDelete, useKeyedGuard } from '@drizztdourden08/brock-react';
import { secretsApi } from '@drizztdourden08/brock-secrets/renderer';
import type { ServerEntry } from '@archipelia/model';
import { appApi } from '../../../ipc/app-api';
import { failWith } from '../../../hooks/fail-with';
import { runStatsOf } from '../../../runs/run-stats-of';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import { useRunsStore } from '../../../stores/useRunsStore';
import { useSessionPickStore } from '../../../stores/useSessionPickStore';
import { duplicateTemplate, passwordNameOf } from '../../SessionBuilder';
import { FAILURE, LEAVE_UNSAVED } from '../Sessions.constants';

const useSessions = () => {
  const { templates, loadTemplates, saveTemplate, removeTemplate } = useLibraryStore();
  const runs = useRunsStore((state) => state.runs);
  const loadRuns = useRunsStore((state) => state.load);
  const [servers, setServers] = useState<ServerEntry[]>([]);
  const { guard, isBusy, errorOf, lastError } = useKeyedGuard();
  const [opened, setOpened] = useState(false);
  const picked = useSessionPickStore((state) => state.selectedId);
  const setDirty = useSessionPickStore((state) => state.setDirty);

  const reload = useCallback(() => guard('load', failWith(FAILURE.load, async () => {
    await Promise.all([loadTemplates(), loadRuns()]);
    setServers(await appApi().serversList());
  })), [guard, loadRuns, loadTemplates]);

  useEffect(() => { void reload().finally(() => setOpened(true)); }, [reload]);

  const selectedId = templates.some((template) => template.id === picked) ? picked : (templates[0]?.id ?? null);

  const select = useCallback((id: string) => {
    const { dirty, select: pick } = useSessionPickStore.getState();
    if (id === selectedId) return;
    if (!dirty) {
      pick(id);
      return;
    }
    void confirmAction(LEAVE_UNSAVED).then((leave) => { if (leave) pick(id); });
  }, [selectedId]);

  const byId = useCallback((id: string) => templates.find((template) => template.id === id), [templates]);

  const duplicate = useCallback((id: string) => {
    const template = byId(id);
    if (template) void guard(id, failWith(FAILURE.duplicate, async () => select((await saveTemplate(duplicateTemplate(template, templates.map((entry) => entry.name)))).id)));
  }, [byId, guard, saveTemplate, select, templates]);

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

  const runStats = useMemo(() => runStatsOf(runs), [runs]);
  const loadError = errorOf('load');

  return {
    actionError: lastError === loadError ? null : lastError, deleteTemplate, duplicate, isBusy, loadError, loading: !opened || isBusy('load'),
    reload, runStats, select, selectedId, servers, setDirty, templates,
  };
};

export { useSessions };
