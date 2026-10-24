/* @layer core @kind config */

const TRUSTED_ROOT_FILE = 'sigstore/trusted-root.json';

const TUF_CACHE_DIR = 'sigstore/tuf';

const TRUSTED_ROOT_REFRESH_MS = 24 * 60 * 60 * 1000;

const TUF_TIMEOUT_MS = 15_000;

export { TRUSTED_ROOT_FILE, TRUSTED_ROOT_REFRESH_MS, TUF_CACHE_DIR, TUF_TIMEOUT_MS };
