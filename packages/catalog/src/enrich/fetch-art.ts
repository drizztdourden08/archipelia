/* @layer core @kind logic */
import type { GithubRepo } from './enrich.type';
import { ART_HOST, ART_TYPES, MAX_ART_BYTES } from './enrich.constants';
import { githubFetch } from './github-fetch';
import { readCapped } from './read-capped';

const fetchArt = async (fetchFn: typeof fetch, { owner, repo }: GithubRepo): Promise<string | undefined> => {
  const res = await githubFetch(fetchFn, `${ART_HOST}/${owner}/${repo}`);
  const type = res.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() ?? '';
  if (!res.ok || !ART_TYPES.includes(type)) {
    await res.body?.cancel();
    return undefined;
  }
  const bytes = await readCapped(res, MAX_ART_BYTES);
  return bytes ? `data:${type};base64,${Buffer.from(bytes).toString('base64')}` : undefined;
};

export { fetchArt };
