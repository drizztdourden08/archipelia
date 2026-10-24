/* @layer renderer-app @kind component */
import { EmptyState, Spinner } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import { GONE } from '../../LobbyDetail.constants';
import type { LobbyMissingProps } from './LobbyMissing.type';

const LobbyMissing = ({ loading, error, onRetry }: LobbyMissingProps) => {
  if (error) return <ErrorCallout message={error} onRetry={onRetry} />;
  if (loading) return <EmptyState icon={<Spinner />} message="Loading the lobby" />;
  return <EmptyState message={GONE} />;
};

export { LobbyMissing };
