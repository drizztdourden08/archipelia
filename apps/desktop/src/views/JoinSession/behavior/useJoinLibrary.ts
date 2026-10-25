/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { useEngineStore } from '../../../stores/useEngineStore';
import { useLibraryStore } from '../../../stores/useLibraryStore';

const useJoinLibrary = () => {
  const installed = useLibraryStore((state) => state.installed);
  const loadInstalled = useLibraryStore((state) => state.loadInstalled);
  const localAp = useEngineStore((state) => state.overview?.active?.ap);
  const loadEngine = useEngineStore((state) => state.load);

  useEffect(() => {
    void loadInstalled().catch(() => undefined);
    void loadEngine().catch(() => undefined);
  }, [loadEngine, loadInstalled]);

  return { installed, localAp };
};

export { useJoinLibrary };
