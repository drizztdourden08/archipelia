/* @layer core @kind logic */
import type { IndexSource } from './index-source.type';

const treeUrl = ({ owner, repo, ref }: IndexSource, sha: string = ref, recursive = true) =>
  `https://api.github.com/repos/${owner}/${repo}/git/trees/${sha}${recursive ? '?recursive=1' : ''}`;

export { treeUrl };
