/* @layer renderer-app @kind hook */
import { useEffect, useMemo } from 'react';
import type { SessionTemplate } from '@archipelia/model';
import { SESSION_FAILED } from '../../../hooks/lobby-hooks.constants';
import { logFailure } from '../../../hooks/log-failure';
import { useLibraryStore } from '../../../stores/useLibraryStore';
import type { DirectWorld } from '../SessionBuilder.type';
import { directWorldsOf } from './direct-worlds';
import { mayJoinDirectly } from './may-join-directly';

const useDirectWorlds = ({ players }: SessionTemplate): DirectWorld[] => {
  const { catalog, installed, loadGames } = useLibraryStore();
  const wanted = mayJoinDirectly(players, installed);
  useEffect(() => {
    if (wanted && catalog === null) loadGames().catch((err: unknown) => logFailure(SESSION_FAILED.data, err));
  }, [wanted, catalog, loadGames]);
  return useMemo(() => (wanted ? directWorldsOf(players, installed, catalog?.entries ?? []) : []), [wanted, players, installed, catalog]);
};

export { useDirectWorlds };
