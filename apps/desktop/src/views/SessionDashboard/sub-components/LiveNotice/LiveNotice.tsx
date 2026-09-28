/* @layer renderer-app @kind component */
import { Text } from '@drizztdourden08/tessera/primitives';
import type { LiveNoticeProps } from './LiveNotice.type';
import { PasswordPrompt } from '../PasswordPrompt';
import { PHASE_TEXT } from './LiveNotice.constants';

const LiveNotice = ({ phase, error, onPassword }: LiveNoticeProps) => {
  if (phase === 'password') return <PasswordPrompt error={error} onSubmit={onPassword} />;
  if (phase === 'failed') return <Text variant="caption" role="alert">{`Live view failed: ${error ?? 'no answer'}`}</Text>;
  const text = PHASE_TEXT[phase];
  return text ? <Text variant="caption">{text}</Text> : null;
};

export { LiveNotice };
