/* @layer core @kind config */
import type { ReadyCache } from './ready.type';

const WORLD_TOPIC = 'archipelia-world';

const DIRECT_TOPIC = 'archipelia-direct';

const SEARCH_URL = 'https://api.github.com/search/repositories';

const SEARCH_QUERY = `topic:${WORLD_TOPIC} archived:false`;

const PAGE_SIZE = 100;

const MAX_PAGES = 5;

const SEARCH_CACHE_FILE = 'ready-search.json';

const MANIFEST_CACHE_FILE = 'ready-manifests.json';

const READY_REFRESH_MS = 6 * 60 * 60 * 1000;

const FORCE_GAP_MS = 60 * 1000;

const READY_CONCURRENCY = 4;

const MAX_READY_WORLD_BYTES = 64 * 1024 * 1024;

const MAX_PRERELEASE_CHECKS = 5;

const FULL_NAME = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

const NEXT_LINK = /<([^>]+)>;\s*rel="next"/;

const NOT_MODIFIED = 304;

const EMPTY_CACHE: ReadyCache = { fetchedAt: 0, total: 0, fetched: 0, repos: [] };

export {
  DIRECT_TOPIC, EMPTY_CACHE, FORCE_GAP_MS, FULL_NAME, MANIFEST_CACHE_FILE, MAX_PAGES, MAX_PRERELEASE_CHECKS, MAX_READY_WORLD_BYTES, NEXT_LINK, NOT_MODIFIED, PAGE_SIZE, READY_CONCURRENCY, READY_REFRESH_MS,
  SEARCH_CACHE_FILE, SEARCH_QUERY, SEARCH_URL, WORLD_TOPIC,
};
