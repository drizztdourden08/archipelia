/* @layer core @kind config */

const ENRICH_DIR = 'enrich';

const RECORD_VERSION = 1;

const DAY_MS = 24 * 60 * 60 * 1000;

const TTL_MS = 7 * DAY_MS;

const NEGATIVE_TTL_MS = DAY_MS;

const FAIL_BACKOFF_MS = 5 * 60 * 1000;

const MAX_PARALLEL = 3;

const FETCH_TIMEOUT_MS = 10_000;

const OPTIONAL_TEXT_KEYS = ['summary', 'details', 'art', 'etag', 'readmeUrl'];

const SAFE_WORLD = /^[A-Za-z0-9_][A-Za-z0-9_.-]{0,79}$/;

const RAW_HOST = 'https://raw.githubusercontent.com';

const ART_HOST = 'https://opengraph.githubassets.com/1';

const GITHUB_HOSTS = ['github.com', 'www.github.com'];

const REFS = ['HEAD', 'main', 'master'];

const README_NAMES = ['README.md', 'readme.md'];

const MAX_README_BYTES = 256 * 1024;

const MAX_DOC_CHARS = 100_000;

const MAX_ART_BYTES = 800 * 1024;

const ART_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

const SUMMARY_MAX = 240;

const DETAILS_MAX = 4000;

const MIN_INTRO = 25;

const SKIP_HEADING = /options page|set ?up|install|getting started|table of contents|contents|usage|requirements|download|license|changelog|how to/i;

export {
  ART_HOST, ART_TYPES, DAY_MS, DETAILS_MAX, ENRICH_DIR, FAIL_BACKOFF_MS, FETCH_TIMEOUT_MS, GITHUB_HOSTS, MAX_ART_BYTES, MAX_DOC_CHARS, MAX_PARALLEL,
  MAX_README_BYTES, MIN_INTRO, NEGATIVE_TTL_MS, OPTIONAL_TEXT_KEYS, RAW_HOST, README_NAMES, RECORD_VERSION, REFS, SAFE_WORLD, SKIP_HEADING, SUMMARY_MAX, TTL_MS,
};
