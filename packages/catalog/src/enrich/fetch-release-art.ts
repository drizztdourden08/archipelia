/* @layer core @kind logic */
import type { GithubRepo, ImageInfo } from './enrich.type';
import { MAX_RELEASE_ART_BYTES, MAX_RELEASE_ART_HEIGHT, MAX_RELEASE_ART_WIDTH, RELEASE_ART_NAMES } from './enrich.constants';
import { fetchReleaseFile } from './fetch-release-file';
import { sniffImage } from './sniff-image';

const fits = ({ width, height, animated }: ImageInfo): boolean =>
  !animated && width > 0 && height > 0 && width <= MAX_RELEASE_ART_WIDTH && height <= MAX_RELEASE_ART_HEIGHT;

const fetchReleaseArt = async (fetchFn: typeof fetch, repo: GithubRepo): Promise<string | undefined> => {
  for (const name of RELEASE_ART_NAMES) {
    const bytes = await fetchReleaseFile(fetchFn, repo, name, MAX_RELEASE_ART_BYTES);
    const image = bytes && sniffImage(bytes);
    if (bytes && image && fits(image)) return `data:${image.type};base64,${Buffer.from(bytes).toString('base64')}`;
  }
  return undefined;
};

export { fetchReleaseArt };
