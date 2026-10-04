/* @layer renderer-app @kind hook */
import { useKeyedGuard, usePlatform } from '@drizztdourden08/brock-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { lastGuardError } from '../../../state/last-guard-error';
import { useLibraryStore } from '../../../state/useLibraryStore';
import type { GameTab } from '../GameStore.type';
import { buildRows } from './build-rows';
import { filterRows } from './filter-rows';
import type { InstallRequest } from '../../../ipc/contract.type';
import { APWORLD } from '../GameStore.constants';

const useGameStore = (tab: GameTab) => {
  const { catalog, official, installed, loadGames, install, removeGame } = useLibraryStore();
  const { filePicker } = usePlatform();
  const [query, setQuery] = useState('');
  const guarded = useKeyedGuard();
  const { guard, isBusy } = guarded;
  const error = lastGuardError(guarded);

  useEffect(() => { void guard('load', () => loadGames(false)); }, [guard, loadGames]);

  const rows = useMemo(() => buildRows([...official, ...(catalog?.entries ?? [])], installed), [catalog, official, installed]);
  const visible = useMemo(() => filterRows(rows, tab, query), [rows, tab, query]);

  const installWorld = useCallback((request: InstallRequest, key: string) => guard(key, () => install(request)), [guard, install]);
  const remove = useCallback((apworld: string) => guard(apworld, () => removeGame(apworld)), [guard, removeGame]);
  const refresh = useCallback(() => guard('load', () => loadGames(true)), [guard, loadGames]);
  const addFromFile = useCallback(() => guard('file', async () => {
    const picked = await filePicker.pickFile({ extensions: APWORLD });
    if (picked) await install({ kind: 'file', fileName: picked.name, bytes: picked.bytes });
  }), [guard, filePicker, install]);

  return { addFromFile, catalog, error, installWorld, installed, isBusy, query, refresh, remove, rows, setQuery, visible };
};

export { useGameStore };
