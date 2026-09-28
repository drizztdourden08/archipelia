/* @layer core @kind config */

const INDEX_FILE = /^index\/[^/]+\.toml$/;

const ROOT_FILES = new Set(['index.toml', 'index.lock']);

export { INDEX_FILE, ROOT_FILES };
