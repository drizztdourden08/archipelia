/* @layer core @kind logic */
import type { Fetch } from '../install/fetch-file.type';
import type { WheelSite } from './wheel.type';
import { releaseAssetUrl } from './release-asset-url';
import { CDN_HOSTS, DOWNLOAD_TIMEOUT_MS, MAX_REDIRECTS } from './wheel.constants';

const allowed = (url: URL, hop: number, start: string): boolean =>
  (hop === 0 ? url.href === start : url.protocol === 'https:' && url.port === '' && CDN_HOSTS.includes(url.hostname));

const fetchReleaseAsset = async (site: WheelSite, request: Fetch): Promise<Response> => {
  const start = releaseAssetUrl(site);
  let current = new URL(start);
  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    if (!allowed(current, hop, start)) throw new Error('Archipelia only downloads release files from github.com over https.');
    const res = await request(current.href, { redirect: 'manual', headers: { 'user-agent': 'Archipelia' }, signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS) });
    const next = res.status >= 300 && res.status < 400 ? res.headers.get('location') : null;
    if (next === null) return res;
    await res.body?.cancel();
    current = new URL(next, current);
  }
  throw new Error('GitHub sent the download around too many times.');
};

export { fetchReleaseAsset };
