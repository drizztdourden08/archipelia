/* @layer renderer-app @kind config */
import type { ButtonVariant } from '@drizztdourden08/tessera/primitives';

const NO_DESCRIPTION = 'This world has no description yet.';

const LOADING_DESCRIPTION = 'Reading the description';

const README_HEADING_OFFSET = 2;

const ART_SIZE = 64;

const VERSION_FIELD = 'game-details-version';

const VERSION_TEXT = { label: 'Version', loading: 'Reading the versions', prerelease: 'Pre-release', world: 'World version', none: 'No version to choose from' } as const;

const BUTTON_VARIANT: Record<'primary' | 'danger' | 'default', ButtonVariant> = { primary: 'primary', danger: 'danger', default: 'secondary' };

export { ART_SIZE, BUTTON_VARIANT, LOADING_DESCRIPTION, NO_DESCRIPTION, README_HEADING_OFFSET, VERSION_FIELD, VERSION_TEXT };
