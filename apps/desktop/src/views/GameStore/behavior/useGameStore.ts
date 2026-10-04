/* @layer renderer-app @kind hook */
import { confirmDelete, toast, useKeyedGuard, useNavigation, usePlatform, useScreenState } from '@drizztdourden08/brock-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import type { GameRow, GameTab } from '../GameStore.type';
import { appApi } from '../../../ipc/app-api';
import { buildRows } from './build-rows';
import { filterRows } from './filter-rows';
import { removeGameConfirm } from './remove-game-confirm';
import { useCardLimit } from './useCardLimit';
import type { InstallRequest } from '@archipelia/catalog';
import { APWORLD, FAILURE } from '../GameStore.constants';
import { failWith } from '../../../hooks/fail-with';
import { toastInstalled } from './toast-installed';
import { useInstalledEntries } from './useInstalledEntries';
import { emptyKind } from './empty-kind';
import { removeKey } from './remove-key';
import { ROUTE } from '../../../hooks/app-navigation.constants';

const useGameStore = (tab: GameTab) => {
  const { catalog, official, installed, loadGames, install, removeGame } = useLibraryStore();
  const { filePicker } = usePlatform();
  const { open } = useNavigation();
  const [query, setQuery] = useScreenState('query', '');
  const [opened, setOpened] = useState(false);
  const { guard, isBusy, errorOf, lastError: error } = useKeyedGuard();

  const load = useCallback((fresh: boolean) => guard('load', failWith(FAILURE.load, () => loadGames(fresh))), [guard, loadGames]);
  useEffect(() => { void load(false).finally(() => setOpened(true)); }, [load]);
  const loading = !opened || isBusy('load');

  useInstalledEntries(installed);

  const rows = useMemo(() => buildRows([...official, ...(catalog?.entries ?? [])], installed), [catalog, official, installed]);
  const visible = useMemo(() => filterRows(rows, tab, query), [rows, tab, query]);
  const cards = useCardLimit(visible.length, `${tab}:${query}`);
  const empty = emptyKind(tab, query, loading);

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
  const openOfficial = useCallback(() => open(ROUTE.officialGames), [open]);

  const loadFailed = errorOf('load') !== null;

  return {
    addFromFile, cards, catalog, empty, error, installWorld, installed, isBusy, loadFailed, loading, openOfficial, query, refresh, remove, retry, rows, setQuery, visible,
  };
};

export { useGameStore };
