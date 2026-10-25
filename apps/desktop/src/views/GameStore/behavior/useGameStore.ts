/* @layer renderer-app @kind hook */
import { confirmDelete, toast, useKeyedGuard, usePlatform, useScreenState } from '@drizztdourden08/brock-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import type { FilterClause } from '@drizztdourden08/tessera/data';
import type { GameRow } from '../GameStore.type';
import { appApi } from '../../../ipc/app-api';
import { buildRows } from './build-rows';
import { filterRows } from './filter-rows';
import { removeGameConfirm } from './remove-game-confirm';
import { groupSections } from './group-sections';
import { summaryOf } from './summary-of';
import type { InstallRequest } from '@archipelia/catalog';
import { APWORLD, FAILURE } from '../GameStore.constants';
import { failWith } from '../../../hooks/fail-with';
import { toastInstalled } from './toast-installed';
import { useInstalledEntries } from './useInstalledEntries';
import { emptyKind } from './empty-kind';
import { removeKey } from './remove-key';
import { NO_FILTERS } from './useGameStore.constants';

const useGameStore = () => {
  const { catalog, official, installed, loadGames, install, removeGame } = useLibraryStore();
  const { filePicker } = usePlatform();
  const [query, setQuery] = useScreenState('query', '');
  const [filters, setFilters] = useScreenState<readonly FilterClause[]>('filters', NO_FILTERS);
  const [opened, setOpened] = useState(false);
  const { guard, isBusy, errorOf, lastError: error } = useKeyedGuard();

  const load = useCallback((fresh: boolean) => guard('load', failWith(FAILURE.load, () => loadGames(fresh))), [guard, loadGames]);
  useEffect(() => { void load(false).finally(() => setOpened(true)); }, [load]);
  const loading = !opened || isBusy('load');

  useInstalledEntries(installed);

  const rows = useMemo(() => buildRows([...official, ...(catalog?.entries ?? [])], installed), [catalog, official, installed]);
  const visible = useMemo(() => filterRows(rows, query, filters), [rows, query, filters]);
  const sections = useMemo(() => groupSections(visible), [visible]);
  const filtered = query.trim() !== '' || filters.length > 0;
  const summary = useMemo(() => summaryOf(rows, visible.length, catalog?.apVersion), [rows, visible, catalog]);
  const empty = emptyKind(filtered, loading);

  const installWorld = useCallback((request: InstallRequest, key: string) => guard(key, failWith(FAILURE.install, async () => toastInstalled(await install(request)))), [guard, install]);
  const remove = useCallback(({ entry, installed: game }: GameRow) => guard(removeKey(entry.apworld), failWith(FAILURE.remove, async () => {
    const [presets, templates] = await Promise.all([appApi().presetsList(), appApi().templatesList()]);
    const confirm = removeGameConfirm(entry.displayName, game?.game ?? entry.displayName, presets, templates);
    if (!(await confirmDelete(confirm))) return;
    await removeGame(entry.apworld);
    toast(`Removed ${entry.displayName}`, { variant: 'success' });
  })), [guard, removeGame]);
  const refresh = useCallback(() => load(true), [load]);
  const retry = useCallback(() => load(false), [load]);
  const addFromFile = useCallback(() => guard('file', failWith(FAILURE.file, async () => {
    const picked = await filePicker.pickFile({ extensions: APWORLD });
    if (picked) toastInstalled(await install({ kind: 'file', fileName: picked.name, bytes: picked.bytes }));
  })), [guard, filePicker, install]);

  const loadFailed = errorOf('load') !== null;

  return {
    addFromFile, empty, error, filtered, filters, installWorld, isBusy, loadFailed, loading, query, refresh, remove, retry, sections, setFilters, setQuery, summary, visible,
  };
};

export { useGameStore };
