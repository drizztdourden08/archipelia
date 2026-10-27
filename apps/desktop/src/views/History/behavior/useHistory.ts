/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useKeyedGuard, usePageSearch } from '@drizztdourden08/brock-react';
import { failWith } from '../../../hooks/fail-with';
import { useHistoryFilterStore } from '../../../stores/useHistoryFilterStore';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import { useRunsStore } from '../../../stores/useRunsStore';
import { FAILURE } from '../History.constants';
import { filterRuns } from './filter-runs';
import { sessionOptions } from './session-options';
import { useHistoryActions } from './useHistoryActions';

const useHistory = () => {
  const runs = useRunsStore((state) => state.runs);
  const loadRuns = useRunsStore((state) => state.load);
  const templates = useLibraryStore((state) => state.templates);
  const loadTemplates = useLibraryStore((state) => state.loadTemplates);
  const filter = useHistoryFilterStore();
  const query = usePageSearch();
  const { guard, isBusy, errorOf, lastError } = useKeyedGuard();
  const [opened, setOpened] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const reload = useCallback(() => guard('load', failWith(FAILURE.load, async () => {
    await Promise.all([loadTemplates(), loadRuns()]);
  })), [guard, loadRuns, loadTemplates]);

  useEffect(() => { void reload().finally(() => setOpened(true)); }, [reload]);

  const { sessionKey, status, range } = filter;
  const shown = useMemo(() => filterRuns(runs, { sessionKey, status, range }, query, Date.now()), [runs, sessionKey, status, range, query]);
  const options = useMemo(() => sessionOptions(runs, templates), [runs, templates]);
  const actions = useHistoryActions({ runs, guard });
  const loadError = errorOf('load');

  return {
    ...actions,
    actionError: lastError === loadError ? null : lastError,
    filter,
    isBusy,
    loadError,
    loading: !opened || isBusy('load'),
    options,
    reload,
    select: setSelectedId,
    selected: shown.find((run) => run.id === selectedId) ?? null,
    selectedId,
    shown,
    templates,
    total: runs.length,
  };
};

export { useHistory };
