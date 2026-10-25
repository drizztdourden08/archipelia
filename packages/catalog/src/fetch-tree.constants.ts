/* @layer core @kind config */

const INDEX_FILE = /^index\/[^/]+\.toml$/;

const ROOT_FILES = new Set(['index.toml', 'index.lock']);

const INDEX_DIR = 'index';

export { INDEX_DIR, INDEX_FILE, ROOT_FILES };
