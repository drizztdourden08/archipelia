/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useSearchEntries } from '@drizztdourden08/brock-react';
import type { InstalledGame } from '@archipelia/model';
import { ROUTE } from '../../../hooks/app-navigation.constants';

const useInstalledEntries = (installed: readonly InstalledGame[]): void => {
  const entries = useMemo(() => installed.map((game) => ({
    id: game.apworld,
    params: { game: game.apworld },
    label: game.game,
    description: `Installed, version ${game.version}`,
    keywords: ['game', 'installed', 'apworld', game.apworld],
  })), [installed]);
  useSearchEntries(entries, ROUTE.games);
};

export { useInstalledEntries };
