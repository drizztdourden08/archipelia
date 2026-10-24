/* @layer core @kind config */

const RELEASES_URL = 'https://api.github.com/repos/ArchipelagoMW/Archipelago/releases?per_page=100';

const COMMIT_URL = 'https://api.github.com/repos/ArchipelagoMW/Archipelago/commits';

const RAW_URL = 'https://raw.githubusercontent.com/ArchipelagoMW/Archipelago';

const PYTHON_LATEST_URL = 'https://raw.githubusercontent.com/astral-sh/python-build-standalone/latest-release/latest-release.json';

const GITHUB_JSON = 'application/vnd.github+json';

const GITHUB_SHA = 'application/vnd.github.sha';

const MAX_RELEASE_PAGES = 10;

const FORCE_GAP_MS = 60_000;

const HOUR_MS = 3_600_000;

const STABLE_TAG = /^\d+\.\d+\.\d+$/;

const NEXT_LINK = /<([^>]+)>\s*;\s*rel="next"/;

const COMMIT_SHA = /^[0-9a-f]{40}$/;

const SUMS_LINE = /^([0-9a-f]{64})\s+\*?(\S+)$/;

const TARGET_TRIPLES: Record<string, string> = {
  'win32-x64': 'x86_64-pc-windows-msvc',
  'win32-arm64': 'aarch64-pc-windows-msvc',
  'linux-x64': 'x86_64-unknown-linux-gnu',
  'linux-arm64': 'aarch64-unknown-linux-gnu',
  'darwin-x64': 'x86_64-apple-darwin',
  'darwin-arm64': 'aarch64-apple-darwin',
};

export {
  COMMIT_SHA, COMMIT_URL, FORCE_GAP_MS, GITHUB_JSON, GITHUB_SHA, HOUR_MS, MAX_RELEASE_PAGES, NEXT_LINK, PYTHON_LATEST_URL, RAW_URL,
  RELEASES_URL, STABLE_TAG, SUMS_LINE, TARGET_TRIPLES,
};
