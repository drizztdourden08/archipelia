/* @layer renderer-app @kind component */
import { widgetWindowId } from '@drizztdourden08/brock-react';
import { EmptyState, Spinner } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { useSessionView } from '../../../../hooks/useSessionView';
import { reloadRuns } from '../../../../runs/reload-runs';
import { RUNS_FAILED } from '../../../../runs/runs.constants';
import { LOADING_TEXT, NO_SESSION_TEXT } from './NoSession.constants';

const NoSession = () => {
  const { loaded, failed } = useSessionView();
  if (loaded) return <EmptyState message={NO_SESSION_TEXT} />;
  if (failed) return <ErrorCallout message={RUNS_FAILED} onRetry={widgetWindowId() === null ? reloadRuns : undefined} />;
  return <EmptyState icon={<Spinner />} message={LOADING_TEXT} />;
};

export { NoSession };
