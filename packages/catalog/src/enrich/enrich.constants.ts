/* @layer core @kind config */

const ENRICH_DIR = 'enrich';

const RECORD_VERSION = 2;

const DAY_MS = 24 * 60 * 60 * 1000;

const TTL_MS = 7 * DAY_MS;

const NEGATIVE_TTL_MS = DAY_MS;

const FAIL_BACKOFF_MS = 5 * 60 * 1000;

const MAX_PARALLEL = 3;

const FETCH_TIMEOUT_MS = 10_000;

const OPTIONAL_TEXT_KEYS = ['markdown', 'art', 'etag', 'readmeUrl'];

const SAFE_WORLD = /^[A-Za-z0-9_][A-Za-z0-9_.-]{0,79}$/;

const RAW_HOST = 'https://raw.githubusercontent.com';

const ART_HOST = 'https://opengraph.githubassets.com/1';

const GITHUB_HOSTS = ['github.com', 'www.github.com'];

const REFS = ['HEAD', 'main', 'master'];

const README_NAMES = ['README.md', 'readme.md'];

const MAX_README_BYTES = 256 * 1024;

const MAX_DOC_CHARS = 40_000;

const MAX_ART_BYTES = 800 * 1024;

const ART_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

const RELEASE_ART_NAMES = ['archipelia-thumbnail.png', 'archipelia-thumbnail.webp'];

const RELEASE_DESCRIPTION_NAME = 'archipelia-description.md';

const MAX_RELEASE_ART_BYTES = 1024 * 1024;

const MAX_RELEASE_DESCRIPTION_BYTES = 64 * 1024;

const MAX_RELEASE_ART_WIDTH = 2048;

const MAX_RELEASE_ART_HEIGHT = 1024;

const RELEASE_HOSTS = /^(?:github\.com|(?:[a-z0-9-]+\.)*githubusercontent\.com)$/;

const GITHUB_WEB = 'https://github.com';

const SCHEME = /^[a-z][a-z0-9+.-]*:/i;

const FENCE_LINE = /^\s{0,3}(?:`{3,}|~{3,})/;

const INLINE_LINK = /(\]\(\s*<?)([^)\s>]+)/g;

const REFERENCE_LINK = /^(\s{0,3}\[[^\]]+\]:\s*<?)(\S+?)(?=>|\s|$)/;

export {
  ART_HOST, ART_TYPES, DAY_MS, ENRICH_DIR, FAIL_BACKOFF_MS, FENCE_LINE, FETCH_TIMEOUT_MS, GITHUB_HOSTS, GITHUB_WEB, INLINE_LINK, MAX_ART_BYTES, MAX_DOC_CHARS,
  MAX_PARALLEL, MAX_README_BYTES, MAX_RELEASE_ART_BYTES, MAX_RELEASE_ART_HEIGHT, MAX_RELEASE_ART_WIDTH, MAX_RELEASE_DESCRIPTION_BYTES, NEGATIVE_TTL_MS, OPTIONAL_TEXT_KEYS,
  RAW_HOST, README_NAMES, RECORD_VERSION, REFERENCE_LINK, REFS, RELEASE_ART_NAMES, RELEASE_DESCRIPTION_NAME, RELEASE_HOSTS, SAFE_WORLD, SCHEME, TTL_MS,
};
