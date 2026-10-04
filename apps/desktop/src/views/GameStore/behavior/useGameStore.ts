/* @layer renderer-app @kind hook */
import { confirmAction, toast, useKeyedGuard, usePlatform, useScreenState } from '@drizztdourden08/brock-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import type { GameRow, GameTab } from '../GameStore.type';
import { appApi } from '../../../ipc/app-api';
import { buildRows } from './build-rows';
import { filterRows } from './filter-rows';
import { removeGameConfirm } from './remove-game-confirm';
import { useCardLimit } from './useCardLimit';
import type { InstallRequest } from '@archipelia/catalog';
import { APWORLD } from '../GameStore.constants';
import { toastInstalled } from './toast-installed';
import { useInstalledEntries } from './useInstalledEntries';

const useGameStore = (tab: GameTab) => {
  const { catalog, official, installed, loadGames, install, removeGame } = useLibraryStore();
  const { filePicker } = usePlatform();
  const [query, setQuery] = useScreenState('query', '');
  const [opened, setOpened] = useState(false);
  const { guard, isBusy, lastError: error } = useKeyedGuard();

  useEffect(() => { void guard('load', () => loadGames(false)).finally(() => setOpened(true)); }, [guard, loadGames]);
  const loading = !opened || isBusy('load');

  useInstalledEntries(installed);

  const rows = useMemo(() => buildRows([...official, ...(catalog?.entries ?? [])], installed), [catalog, official, installed]);
  const visible = useMemo(() => filterRows(rows, tab, query), [rows, tab, query]);
  const cards = useCardLimit(visible.length, `${tab}:${query}`);

  const installWorld = useCallback((request: InstallRequest, key: string) => guard(key, async () => toastInstalled(await install(request))), [guard, install]);
  const remove = useCallback(({ entry, installed: game }: GameRow) => guard(entry.apworld, async () => {
    const [presets, templates] = await Promise.all([appApi().presetsList(), appApi().templatesList()]);
    const confirm = removeGameConfirm(entry.displayName, game?.game ?? entry.displayName, presets, templates);
    if (!(await confirmAction(confirm))) return;
    await removeGame(entry.apworld);
    toast(`Removed ${entry.displayName}`, { variant: 'success' });
  }), [guard, removeGame]);
  const refresh = useCallback(() => guard('load', () => loadGames(true)), [guard, loadGames]);
  const addFromFile = useCallback(() => guard('file', async () => {
    const picked = await filePicker.pickFile({ extensions: APWORLD });
    if (picked) toastInstalled(await install({ kind: 'file', fileName: picked.name, bytes: picked.bytes }));
  }), [guard, filePicker, install]);

  return { addFromFile, cards, catalog, error, installWorld, installed, isBusy, loading, query, refresh, remove, rows, setQuery, visible };
};

export { useGameStore };
