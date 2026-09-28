/* @layer core @kind logic */
import type { IndexSource } from './index-source.type';

const rawUrl = ({ owner, repo, ref }: IndexSource, path: string) =>
  `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path.split('/').map(encodeURIComponent).join('/')}`;

export { rawUrl };
