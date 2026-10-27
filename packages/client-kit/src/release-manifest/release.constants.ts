/* @layer client-kit @kind config */

const RELEASE_FORMAT = 1;

const KIT_VERSION = '0.2.0';

const MANIFEST_NAME = 'archipelia.json';

const THUMBNAIL_BASE_NAME = 'archipelia-thumbnail';

const DESCRIPTION_NAME = 'archipelia-description.md';

const MAX_MANIFEST_BYTES = 64 * 1024;

const APWORLD_FILE_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]*\.apworld$/;

const KIT_VERSION_TEXT = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

export { APWORLD_FILE_NAME, DESCRIPTION_NAME, KIT_VERSION, KIT_VERSION_TEXT, MANIFEST_NAME, MAX_MANIFEST_BYTES, RELEASE_FORMAT, THUMBNAIL_BASE_NAME };
