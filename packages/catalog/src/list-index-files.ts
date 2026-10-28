/* @layer core @kind logic */
import { fetchIndexTree } from './fetch-tree';
import type { CacheTarget } from './file-cache.type';
import type { IndexSource } from './index-source.type';
import type { Listing } from './list-index-files.type';
import { readTreeCache } from './read-tree-cache';
import { GithubLimitError } from './source/github-limit-error';
import { writeTreeCache } from './write-tree-cache';

const listIndexFiles = async (source: IndexSource, target: CacheTarget): Promise<Listing> => {
  try {
    const files = await fetchIndexTree(source);
    await writeTreeCache(source, target, { at: Date.now(), files });
    return { files };
  } catch (err) {
    if (!(err instanceof GithubLimitError)) throw err;
    const stored = await readTreeCache(source, target);
    if (!stored) throw err;
    return { files: stored.files, limited: { listedAt: stored.at, limitedUntil: err.resetAt } };
  }
};

export { listIndexFiles };
