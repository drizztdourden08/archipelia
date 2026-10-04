/* @layer renderer-app @kind logic */
import { useRunsStore } from '../stores/useRunsStore';
import { logFailure } from '../hooks/log-failure';
import { RUNS_FAILED } from './runs.constants';

const reloadRuns = (): void => {
  useRunsStore.getState().load().catch((err: unknown) => logFailure(RUNS_FAILED, err));
};

export { reloadRuns };
