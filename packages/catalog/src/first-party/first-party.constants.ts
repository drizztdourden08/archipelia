/* @layer core @kind config */

const NO_RELEASE = 'No release yet';

const STANDARD_MANIFEST = 'archipelia.json';

const STANDARD_FORMAT = 1;

const MAX_MANIFEST_BYTES = 64 * 1024;

const BUNDLE_SUFFIX = '.sigstore.json';

const RELEASE_HOST = 'https://github.com';

const MANIFEST_CONCURRENCY = 8;

const UNVERIFIED_DETAIL = 'Not verified yet: this release has no attestation bundle, so only its checksum was checked.';

const NOT_REVIEWED = 'Not reviewed';

export { BUNDLE_SUFFIX, MANIFEST_CONCURRENCY, MAX_MANIFEST_BYTES, NOT_REVIEWED, NO_RELEASE, RELEASE_HOST, STANDARD_FORMAT, STANDARD_MANIFEST, UNVERIFIED_DETAIL };
