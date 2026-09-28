/* @layer renderer-app @kind hook */
import { usePlatform } from '@drizztdourden08/brock-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLibraryStore } from '../../../state/useLibraryStore';
import type { GameTab } from '../GameStore.type';
import { useKeyedGuard } from '../../../state/useKeyedGuard';
import { buildRows } from './build-rows';
import { filterRows } from './filter-rows';
import type { InstallRequest } from '../../../ipc/contract.type';
import { APWORLD } from '../GameStore.constants';

const useGameStore = () => {
  const { catalog, official, installed, loadGames, install, removeGame } = useLibraryStore();
  const { filePicker } = usePlatform();
  const [tab, setTab] = useState<GameTab>('installed');
  const [query, setQuery] = useState('');
  const { busy, error, guard } = useKeyedGuard();

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

  return { addFromFile, busy, catalog, error, installWorld, installed, query, refresh, remove, rows, setQuery, setTab, tab, visible };
};

export { useGameStore };
