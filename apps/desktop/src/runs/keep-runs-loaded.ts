/* @layer renderer-app @kind logic */
import { useRunsStore } from '../stores/useRunsStore';
import { reloadRuns } from './reload-runs';

const keepRunsLoaded = (): (() => void) =>
  useRunsStore.subscribe(({ loaded, failed }) => {
    if (!loaded && !failed) reloadRuns();
  });

export { keepRunsLoaded };
