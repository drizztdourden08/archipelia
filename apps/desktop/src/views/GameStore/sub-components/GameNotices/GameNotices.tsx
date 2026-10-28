/* @layer renderer-app @kind component */
import { Callout } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import type { GameNoticesProps } from './GameNotices.type';

const GameNotices = ({ limitText, error, onRetry }: GameNoticesProps) => (
  <>
    {limitText && <Callout tone="info">{limitText}</Callout>}
    {error && <ErrorCallout message={error} onRetry={onRetry} />}
  </>
);

export { GameNotices };
