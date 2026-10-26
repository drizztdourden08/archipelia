/* @layer core @kind logic */
import type { Fetch } from '../install/fetch-file.type';
import { CDN_SUFFIX, DOWNLOAD_TIMEOUT_MS, GITHUB_HOST, MAX_REDIRECTS } from './wheel.constants';

const allowed = (url: URL, first: boolean): boolean =>
  url.protocol === 'https:' && url.port === '' && (url.hostname === GITHUB_HOST || (!first && url.hostname.endsWith(CDN_SUFFIX)));

const fetchReleaseAsset = async (start: string, request: Fetch): Promise<Response> => {
  let current = new URL(start);
  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    if (!allowed(current, hop === 0)) throw new Error('Archipelia only downloads release files from github.com over https.');
    const res = await request(current.href, { redirect: 'manual', headers: { 'user-agent': 'Archipelia' }, signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS) });
    const next = res.status >= 300 && res.status < 400 ? res.headers.get('location') : null;
    if (next === null) return res;
    await res.body?.cancel();
    current = new URL(next, current);
  }
  throw new Error('GitHub sent the download around too many times.');
};

export { fetchReleaseAsset };
