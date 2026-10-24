/* @layer core @kind config */

const REGISTRY_FORMAT = 1;

const REGISTRY_URL = 'https://raw.githubusercontent.com/drizztdourden08/archipelia/main/registry/registry.json';

const REGISTRY_CACHE_FILE = 'registry.json';

const REGISTRY_REFRESH_MS = 6 * 60 * 60 * 1000;

const REGISTRY_FETCH_TIMEOUT_MS = 15_000;

const GITHUB_ISSUER = 'https://token.actions.githubusercontent.com';

export { GITHUB_ISSUER, REGISTRY_CACHE_FILE, REGISTRY_FETCH_TIMEOUT_MS, REGISTRY_FORMAT, REGISTRY_REFRESH_MS, REGISTRY_URL };
