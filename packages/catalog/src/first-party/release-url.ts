/* @layer core @kind logic */
import { RELEASE_HOST } from './first-party.constants';

const releaseUrl = (repo: string, asset: string, tag?: string) =>
  `${RELEASE_HOST}/${repo}/releases/${tag === undefined ? 'latest/download' : `download/${encodeURIComponent(tag)}`}/${encodeURIComponent(asset)}`;

export { releaseUrl };
