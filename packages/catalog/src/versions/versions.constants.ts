/* @layer core @kind config */

const RELEASES_PER_PAGE = 30;

const RELEASES_FILE = 'releases.json';

const RELEASE_MANIFESTS_FILE = 'release-manifests.json';

const MAX_CHECKED_RELEASES = 10;

const CHECK_CONCURRENCY = 4;

const MAX_STORED_REPOS = 30;

const MAX_STORED_MANIFESTS = 400;

const MAX_ASSETS = 200;

const MAX_DATE_LENGTH = 40;

const NOT_FOUND = 404;

const NOT_MODIFIED = 304;

const TAG_NAME = /^[^\s\p{Cc}\p{Cf}\p{Zl}\p{Zp}]{1,100}$/u;

const ASSET_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]{0,199}$/;

const BUILD_VERSION = /^\d+(?:\.\d+)*$/;

const APWORLD_SUFFIX = '.apworld';

const NO_MANIFEST = 'This release has no archipelia.json';

const NOT_CHECKED = 'Older releases are not checked against this Archipelago version';

const UNREADABLE = 'The archipelia.json of this release could not be read';

const NO_PROBLEM = 'The releases could not be read.';

export {
  APWORLD_SUFFIX, ASSET_NAME, BUILD_VERSION, CHECK_CONCURRENCY, MAX_ASSETS, MAX_CHECKED_RELEASES, MAX_DATE_LENGTH, MAX_STORED_MANIFESTS, MAX_STORED_REPOS, NOT_CHECKED, NOT_FOUND, NOT_MODIFIED,
  NO_MANIFEST, NO_PROBLEM, RELEASE_MANIFESTS_FILE, RELEASES_FILE, RELEASES_PER_PAGE, TAG_NAME, UNREADABLE,
};
