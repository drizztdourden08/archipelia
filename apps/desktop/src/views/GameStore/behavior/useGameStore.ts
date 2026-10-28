/* @layer renderer-app @kind hook */
import { confirmDelete, toast, useKeyedGuard, useNavigation, useScreenState } from '@drizztdourden08/brock-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import type { FilterClause } from '@drizztdourden08/tessera/data';
import type { GameRow, GameTab } from '../GameStore.type';
import { ROUTE } from '../../../hooks/app-navigation.constants';
import { appApi } from '../../../ipc/app-api';
import { buildRows } from './build-rows';
import { filterRows } from './filter-rows';
import { removeGameConfirm } from './remove-game-confirm';
import { sectionsOf } from './sections-of';
import { noReleaseCount } from './no-release-count';
import { summaryOf } from './summary-of';
import { FAILURE } from '../GameStore.constants';
import { failWith } from '../../../hooks/fail-with';
import { failOnWorld } from './fail-on-world';
import { useInstalledEntries } from './useInstalledEntries';
import { useInstallActions } from './useInstallActions';
import { emptyKind } from './empty-kind';
import { removeKey } from './remove-key';
import { limitNotice } from './limit-notice';
import { NO_FILTERS, RETRY_SLACK_MS } from './useGameStore.constants';

const useGameStore = (tab: GameTab) => {
  const { catalog, official, installed, loadGames, removeGame } = useLibraryStore();
  const { open } = useNavigation();
  const [query, setQuery] = useScreenState('query', '');
  const [filters, setFilters] = useScreenState<readonly FilterClause[]>('filters', NO_FILTERS);
  const [opened, setOpened] = useState(false);
  const { guard, isBusy, errorOf } = useKeyedGuard();

  const load = useCallback((fresh: boolean) => guard('load', failWith(FAILURE.load, () => loadGames(fresh))), [guard, loadGames]);
  useEffect(() => { void load(false).finally(() => setOpened(true)); }, [load]);
  const loading = !opened || isBusy('load');
  const limited = catalog?.limited;
  useEffect(() => {
    if (!limited) return undefined;
    const timer = setTimeout(() => { void load(false); }, Math.max(limited.limitedUntil - Date.now(), 0) + RETRY_SLACK_MS);
    return () => clearTimeout(timer);
  }, [limited, load]);
  const limitText = limitNotice(limited, Date.now());

  useInstalledEntries(installed);

  const rows = useMemo(() => buildRows([...official, ...(catalog?.entries ?? [])], installed), [catalog, official, installed]);
  const visible = useMemo(() => filterRows(rows, query, filters), [rows, query, filters]);
  const sections = useMemo(() => sectionsOf(visible, tab), [visible, tab]);
  const shown = useMemo(() => sections.reduce((total, section) => total + section.rows.length, 0), [sections]);
  const filtered = query.trim() !== '' || filters.length > 0;
  const summary = useMemo(() => summaryOf(rows, shown, catalog?.apVersion, noReleaseCount(catalog?.entries)), [rows, shown, catalog]);
  const empty = emptyKind(filtered, loading, tab);

  const { addFromFile, consent, installWorld, needOf } = useInstallActions({ guard, rows });
  const remove = useCallback(({ entry, installed: game }: GameRow) => guard(removeKey(entry.apworld), failOnWorld(FAILURE.remove, async () => {
    const [presets, templates] = await Promise.all([appApi().presetsList(), appApi().templatesList()]);
    const confirm = removeGameConfirm(entry.displayName, game?.game ?? entry.displayName, presets, templates);
    if (!(await confirmDelete(confirm))) return;
    await removeGame(entry.apworld);
    toast(`Removed ${entry.displayName}`, { variant: 'success' });
  })), [guard, removeGame]);
  const refresh = useCallback(() => load(true), [load]);
  const retry = useCallback(() => load(false), [load]);

  const openBuiltIn = useCallback(() => open(ROUTE.builtInGames), [open]);

  const loadFailed = errorOf('load') !== null;
  const error = errorOf('load') ?? errorOf('file');

  return {
    addFromFile, consent, empty, error, errorOf, filtered, filters, installWorld, isBusy, limitText, loadFailed, loading, needOf, openBuiltIn, query, refresh, remove, retry, rows, sections, setFilters, setQuery, shown, summary,
  };
};

export { useGameStore };
