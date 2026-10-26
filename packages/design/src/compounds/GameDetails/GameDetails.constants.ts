/* @layer renderer-app @kind config */
import type { ButtonVariant } from '@drizztdourden08/tessera/primitives';

const NO_DESCRIPTION = 'This world has no description yet.';

const LOADING_DESCRIPTION = 'Reading the description';

const ART_SIZE = 64;

const BUTTON_VARIANT: Record<'primary' | 'danger' | 'default', ButtonVariant> = { primary: 'primary', danger: 'danger', default: 'secondary' };

export { ART_SIZE, BUTTON_VARIANT, LOADING_DESCRIPTION, NO_DESCRIPTION };
