/* @layer renderer-app @kind component */
import { EmptyState, Spinner } from '@drizztdourden08/tessera/primitives';
import { ErrorCallout } from '@archipelia/design';
import type { TextStateProps } from './TextState.type';
import { READ_FAILED } from '../../SessionDashboard.constants';

const TextState = ({ failed, loadingLabel, onRetry }: TextStateProps) =>
  (failed ? <ErrorCallout message={READ_FAILED} onRetry={onRetry} /> : <EmptyState icon={<Spinner />} message={loadingLabel} />);

export { TextState };
