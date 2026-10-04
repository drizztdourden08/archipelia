/* @layer renderer-app @kind component */
import { Box, Button, Callout, Icon } from '@drizztdourden08/tessera/primitives';
import type { ErrorCalloutProps } from './ErrorCallout.type';

const ErrorCallout = ({ message, onRetry }: ErrorCalloutProps) => {
  const retry = onRetry && <Button size="sm" variant="secondary" icon={<Icon name="refresh-cw" />} onClick={onRetry}>Retry</Button>;
  return <Box role="alert"><Callout tone="danger" action={retry}>{message}</Callout></Box>;
};

export { ErrorCallout };
