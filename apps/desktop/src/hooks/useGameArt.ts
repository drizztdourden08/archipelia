/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { enrichKey } from '../stores/enrich-key';
import { useEnrichStore } from '../stores/useEnrichStore';
import { useLibraryStore } from '../stores/useLibraryStore';

const useGameArt = (game: string | undefined): string | undefined => {
  const installed = useLibraryStore((state) => state.installed.find((entry) => entry.game === game));
  const found = useEnrichStore((state) => (installed ? state.found[enrichKey(installed)] : undefined));
  const ask = useEnrichStore((state) => state.ask);
  useEffect(() => {
    if (installed) ask({ apworld: installed.apworld, source: installed.source });
  }, [ask, installed]);
  return found?.art;
};

export { useGameArt };
