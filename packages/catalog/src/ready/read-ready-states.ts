/* @layer core @kind logic */
import { mapPool } from '../pool';
import type { ReleaseState } from '../first-party/first-party.type';
import type { ManifestCache } from './manifest-cache.type';
import { readManifestCache } from './read-manifest-cache';
import { readReadyState } from './read-ready-state';
import type { StatesParams } from './read-ready-states.type';
import { MANIFEST_CACHE_FILE, READY_CONCURRENCY } from './ready.constants';

const readReadyStates = async ({ files, request, now, force, all, wanted }: StatesParams): Promise<Map<number, ReleaseState>> => {
  const cache = await readManifestCache(files);
  const reads = await mapPool(wanted, READY_CONCURRENCY, (repo) => readReadyState(repo, cache[String(repo.id)], { request, now, force }));
  const listed = new Set(all.map((repo) => String(repo.id)));
  const next: ManifestCache = Object.fromEntries(Object.entries(cache).filter(([id]) => listed.has(id)));
  wanted.forEach((repo, at) => {
    const entry = reads[at]?.entry;
    if (entry) next[String(repo.id)] = entry;
  });
  await files.writeJson(MANIFEST_CACHE_FILE, next).catch(() => undefined);
  return new Map(wanted.map((repo, at): [number, ReleaseState] => [repo.id, reads[at]?.state ?? { kind: 'none' }]));
};

export { readReadyStates };
