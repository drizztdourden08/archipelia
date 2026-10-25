/* @layer core @kind logic */
import type { ReadmeParams, ReadmeRead } from './enrich.type';
import { MAX_README_BYTES, RAW_HOST, README_NAMES, REFS } from './enrich.constants';
import { githubFetch } from './github-fetch';
import { readCapped } from './read-capped';

const candidatesOf = ({ repo, url }: ReadmeParams): string[] => {
  const base = `${RAW_HOST}/${repo.owner}/${repo.repo}`;
  const all = REFS.flatMap((ref) => README_NAMES.map((name) => `${base}/${ref}/${name}`));
  return url ? [url, ...all.filter((candidate) => candidate !== url)] : all;
};

const fetchReadme = async (params: ReadmeParams): Promise<ReadmeRead> => {
  for (const url of candidatesOf(params)) {
    const sent = url === params.url && params.etag ? { 'If-None-Match': params.etag } : undefined;
    const res = await githubFetch(params.fetch, url, sent);
    if (res.status === 304) return { kind: 'same' };
    if (res.status === 404) {
      await res.body?.cancel();
      continue;
    }
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    const bytes = await readCapped(res, MAX_README_BYTES);
    if (!bytes) return { kind: 'missing' };
    const etag = res.headers.get('etag');
    return { kind: 'text', text: new TextDecoder().decode(bytes), url, ...(etag ? { etag } : {}) };
  }
  return { kind: 'missing' };
};

export { fetchReadme };
