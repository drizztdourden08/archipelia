/* @layer renderer-app @kind component */
import { EmptyState, Spinner, Text } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import type { LiveNoticeProps } from './LiveNotice.type';
import { PasswordPrompt } from '../PasswordPrompt';
import { CONNECTING_TEXT, PHASE_TEXT } from './LiveNotice.constants';
import { LIVE_FAILED } from '../../../../stores/live-room-store.constants';

const LiveNotice = ({ phase, error, onPassword, onRetry }: LiveNoticeProps) => {
  if (phase === 'password') return <PasswordPrompt error={error} onSubmit={onPassword} />;
  if (phase === 'failed') return <ErrorCallout message={LIVE_FAILED} onRetry={onRetry} />;
  if (phase === 'connecting') return <EmptyState size="sm" icon={<Spinner size="sm" />} message={CONNECTING_TEXT} />;
  const text = PHASE_TEXT[phase];
  return text ? <Text variant="caption">{text}</Text> : null;
};

export { LiveNotice };
