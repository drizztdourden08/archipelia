/* @layer core @kind logic */
import type { IndexSource } from './index-source.type';

const treeUrl = ({ owner, repo, ref }: IndexSource) =>
  `https://api.github.com/repos/${owner}/${repo}/git/trees/${ref}?recursive=1`;

export { treeUrl };
