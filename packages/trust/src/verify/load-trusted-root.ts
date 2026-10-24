/* @layer core @kind logic */
import { TrustedRoot } from '@sigstore/protobuf-specs';
import { fetchTrustedRoot } from './fetch-trusted-root';
import { readTrustedRootCache } from './read-trusted-root-cache';
import { TRUSTED_ROOT_FILE, TRUSTED_ROOT_REFRESH_MS, TUF_CACHE_DIR } from './trusted-root.constants';
import type { LoadTrustedRootDeps, LoadTrustedRootOptions, TrustedRootLoad } from './trusted-root.type';

const loadTrustedRoot = async (deps: LoadTrustedRootDeps, options: LoadTrustedRootOptions = {}): Promise<TrustedRootLoad> => {
  const { files, fetchRoot = fetchTrustedRoot, now = Date.now } = deps;
  const stored = await readTrustedRootCache(files);
  if (stored && !options.force && now() - stored.refreshedAt < TRUSTED_ROOT_REFRESH_MS) {
    return { root: stored.root, source: 'cache', refreshedAt: stored.refreshedAt, problems: [] };
  }
  try {
    const root = await fetchRoot(files.path(TUF_CACHE_DIR));
    const refreshedAt = now();
    await files.writeJson(TRUSTED_ROOT_FILE, { refreshedAt, root: TrustedRoot.toJSON(root) });
    return { root, source: 'tuf', refreshedAt, problems: [] };
  } catch (error) {
    const problem = error instanceof Error ? error.message : String(error);
    if (stored) return { root: stored.root, source: 'cache', refreshedAt: stored.refreshedAt, problems: [problem] };
    throw new Error(`the Sigstore trusted root is not cached and cannot be fetched: ${problem}`, { cause: error });
  }
};

export { loadTrustedRoot };
