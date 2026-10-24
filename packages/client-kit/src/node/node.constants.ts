/* @layer client-kit @kind config */

const SKIPPED_NAMES: ReadonlySet<string> = new Set(['__pycache__', '.git', '.DS_Store', 'Thumbs.db']);

const SKIPPED_SUFFIXES: readonly string[] = ['.pyc', '.pyo'];

const TEXT_SUFFIXES: readonly string[] = ['.py', '.json', '.md', '.txt', '.yaml', '.yml', '.toml', '.cfg', '.ini', '.pyi'];

export { SKIPPED_NAMES, SKIPPED_SUFFIXES, TEXT_SUFFIXES };
