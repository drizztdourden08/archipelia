/* @layer renderer-app @kind component */
import { ConnectionStatus } from '@archipelia/design';
import type { LiveStatusProps } from './LiveStatus.type';
import { RoomPassword } from '../RoomPassword';
import { liveDetail } from '../../behavior/live-detail';

const LiveStatus = ({ connection }: LiveStatusProps) => {
  const { phase, error, retryAt, attempt, attempts, retrying, onPassword, onRetry } = connection;
  return (
    <ConnectionStatus
      phase={phase}
      detail={liveDetail(phase, error)}
      onRetry={onRetry}
      retryAt={retryAt}
      attempt={attempt || undefined}
      attempts={attempts || undefined}
      retrying={retrying}
      auth={<RoomPassword error={error} onSubmit={onPassword} />}
    />
  );
};

export { LiveStatus };
