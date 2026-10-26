/* @layer core @kind config */

const MAX_RELEASES = 30;

const MAX_WHEELS = 8;

const MAX_CACHE_BYTES = 600 * 1024 * 1024;

const PART_MAX_AGE_MS = 60 * 60 * 1000;

const MAX_WHEEL_BYTES = 150 * 1024 * 1024;

const MAX_REDIRECTS = 5;

const DOWNLOAD_TIMEOUT_MS = 10 * 60 * 1000;

const CDN_HOSTS = ['objects.githubusercontent.com', 'release-assets.githubusercontent.com'];

const SHA256 = /^[0-9a-f]{64}$/;

const DIGEST = /^sha256:([0-9a-f]{64})$/i;

const TAG_NAME = /^[A-Za-z0-9][A-Za-z0-9._+/-]{0,99}$/;

const ASSET_NAME = /^[A-Za-z0-9][A-Za-z0-9._+!-]{0,199}\.whl$/;

const SOURCE_FILE = 'source.json';

const PART_SUFFIX = '.part';

const REPO_PATH = /^([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))\/([A-Za-z0-9._-]{1,100})$/;

export {
  ASSET_NAME, CDN_HOSTS, DIGEST, DOWNLOAD_TIMEOUT_MS, MAX_CACHE_BYTES, MAX_REDIRECTS, MAX_RELEASES, MAX_WHEEL_BYTES, MAX_WHEELS, PART_MAX_AGE_MS, PART_SUFFIX, REPO_PATH, SHA256, SOURCE_FILE, TAG_NAME,
};
