/* @layer renderer-app @kind config */
import type { TagValidator } from '@drizztdourden08/tessera/primitives';

const ANY_TAG: TagValidator = () => true;

const NO_SUGGESTIONS: readonly string[] = [];

export { ANY_TAG, NO_SUGGESTIONS };
