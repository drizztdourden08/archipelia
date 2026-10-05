/* @layer renderer-app @kind hook */
import { useFocusStore } from '../stores/useFocusStore';
import { useRunsStore } from '../stores/useRunsStore';

const useSessionContext = (): boolean => {
  const focused = useFocusStore((state) => state.sessionId);
  return useRunsStore((state) => state.runs.some((run) => run.id === focused || run.status === 'hosting'));
};

export { useSessionContext };
