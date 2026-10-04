/* @layer renderer-app @kind component */
import { EmptyState } from '@drizztdourden08/tessera/primitives';
import type { NoSessionProps } from './NoSession.type';
import { LOADING_TEXT, NO_SESSION_TEXT } from './NoSession.constants';

const NoSession = ({ loaded }: NoSessionProps) => <EmptyState message={loaded ? NO_SESSION_TEXT : LOADING_TEXT} />;

export { NoSession };
