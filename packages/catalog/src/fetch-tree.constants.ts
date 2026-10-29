/* @layer core @kind config */

const INDEX_FILE = /^index\/[^/]+\.toml$/;

const ROOT_FILES = new Set(['index.toml', 'index.lock']);

const INDEX_DIR = 'index';

const INDEX_TIMEOUT_MS = 15_000;

export { INDEX_DIR, INDEX_FILE, INDEX_TIMEOUT_MS, ROOT_FILES };
