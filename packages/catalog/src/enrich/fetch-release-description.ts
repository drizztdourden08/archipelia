/* @layer core @kind logic */
import type { GithubRepo } from './enrich.type';
import { MAX_RELEASE_DESCRIPTION_BYTES, RELEASE_DESCRIPTION_NAME } from './enrich.constants';
import { fetchReleaseFile } from './fetch-release-file';
import { markdownOf } from './markdown-of';

const utf8 = (bytes: Uint8Array): string | undefined => {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return undefined;
  }
};

const fetchReleaseDescription = async (fetchFn: typeof fetch, repo: GithubRepo): Promise<string | undefined> => {
  const bytes = await fetchReleaseFile(fetchFn, repo, RELEASE_DESCRIPTION_NAME, MAX_RELEASE_DESCRIPTION_BYTES);
  const text = bytes && utf8(bytes);
  return text ? markdownOf(text, repo) : undefined;
};

export { fetchReleaseDescription };
