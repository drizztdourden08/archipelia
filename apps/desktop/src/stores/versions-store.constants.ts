/* @layer renderer-app @kind config */
import type { VersionList } from '@archipelia/catalog';

const UNREAD_VERSIONS: VersionList = { by: 'tag', choices: [], problem: 'The versions could not be read.' };

export { UNREAD_VERSIONS };
