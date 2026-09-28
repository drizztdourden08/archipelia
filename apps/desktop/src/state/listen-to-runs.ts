/* @layer renderer-app @kind logic */
import { archipeliaApi } from '../ipc/archipelia-api';
import { useRunsStore } from './useRunsStore';

const listenToRuns = () => archipeliaApi().onSessionEvent((event) => useRunsStore.getState().apply(event));

export { listenToRuns };
