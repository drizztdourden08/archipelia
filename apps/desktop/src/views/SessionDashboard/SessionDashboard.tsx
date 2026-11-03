/* @layer renderer-app @kind component */
import { EmptyState, Spinner, Stack } from '@drizztdourden08/tessera/primitives';
import { LobbyStage } from '@archipelia/design';
import type { SessionDashboardProps } from './SessionDashboard.type';
import { RunStage } from './sub-components/RunStage';
import { LOADING_RUN } from './SessionDashboard.constants';
import './SessionDashboard.css';

const SessionDashboard = ({ sessionId }: SessionDashboardProps) => (
  <RunStage sessionId={sessionId}>
    {(stage) => (stage
      ? <Stack gap="md" className="session-dashboard"><LobbyStage {...stage} /></Stack>
      : <EmptyState icon={<Spinner />} message={LOADING_RUN} />)}
  </RunStage>
);

export { SessionDashboard };
