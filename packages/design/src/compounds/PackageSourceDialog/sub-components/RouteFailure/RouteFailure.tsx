/* @layer renderer-app @kind component */
import { retryOf } from '../../behavior/retry-of';
import { FailurePanel } from '../FailurePanel';
import type { RouteFailureProps } from './RouteFailure.type';

const RouteFailure = ({ dialog, wizard, view, message }: RouteFailureProps) => (
  <FailurePanel message={message} onRetry={retryOf(dialog, wizard.values, view)} />
);

export { RouteFailure };
