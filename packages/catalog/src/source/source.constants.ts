/* @layer core @kind config */

const GITHUB_API = 'https://api.github.com';

const API_HEADERS = { accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28', 'user-agent': 'Archipelia' };

const CACHE_MS = 60 * 60 * 1000;

const BLOCK_MS = 60 * 1000;

const NEW_PROJECT_DAYS = 90;

const FEW_STARS = 5;

const MAX_WORLD_LINKS = 6;

const MAX_AUTHOR_REPOS = 5;

const MAX_CHECKED = 14;

const MAX_SHOWN = 10;

const CHECK_PARALLEL = 4;

const MIN_SEARCH_HITS = 3;

const MAX_TAGS = 100;

const MAX_PASTE_CHARS = 300;

const LINK_IN_TEXT = /https?:\/\/(?:www\.)?github\.com\/[^\s)\]>"'<`]+/gi;

const RESERVED_OWNERS = new Set([
  'sponsors', 'orgs', 'topics', 'features', 'marketplace', 'settings', 'apps', 'login', 'join', 'about', 'pricing', 'collections',
  'explore', 'notifications', 'issues', 'pulls', 'search', 'security', 'enterprise', 'customer-stories', 'readme', 'trending',
]);

const TRAILING_PUNCTUATION = /[.,;:!?]+$/;

const SHORT_REPO = /^([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))\/([A-Za-z0-9._-]{1,100})$/;

const MODULE_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;

const COMMIT_SHA = /^[0-9a-f]{40}$/;

const NUMERIC_TAG = /^v?(\d+(?:\.\d+)*)$/;

const NATIVE_FILE = /\.(?:c|cc|cpp|cxx|pyx)$/i;

const NATIVE_BUILD_FILES = new Set(['cargo.toml', 'cmakelists.txt', 'meson.build']);

const SETUP_CFG_NAME = /^\[metadata\][^[]*?^\s*name\s*=\s*([^\s#;]+)/im;

const SETUP_PY_NAME = /\bname\s*=\s*["']([A-Za-z0-9][A-Za-z0-9._-]*)["']/;

const SUBMODULES_FILE = '.gitmodules';

export {
  API_HEADERS, BLOCK_MS, CACHE_MS, CHECK_PARALLEL, COMMIT_SHA, FEW_STARS, GITHUB_API, LINK_IN_TEXT, MAX_AUTHOR_REPOS, MAX_CHECKED, MAX_PASTE_CHARS, MAX_SHOWN,
  MAX_TAGS, MAX_WORLD_LINKS, MIN_SEARCH_HITS, MODULE_NAME, NATIVE_BUILD_FILES, NATIVE_FILE, NEW_PROJECT_DAYS, NUMERIC_TAG, RESERVED_OWNERS,
  SETUP_CFG_NAME, SETUP_PY_NAME, SHORT_REPO, SUBMODULES_FILE, TRAILING_PUNCTUATION,
};
