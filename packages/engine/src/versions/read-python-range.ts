/* @layer core @kind logic */
import type { PythonRange } from '@archipelia/model';
import { FEED_TIMEOUT_MS, RAW_URL } from './feed-sources.constants';
import { requireOk } from './require-ok';
import type { RangeRequest } from './read-python-range.type';
import { resolvePythonRange } from './resolve-python-range';

const readPythonRange = async ({ fetch, store, commit, ap, platform, defaults }: RangeRequest): Promise<PythonRange> => {
  const key = `${commit}:${platform}`;
  const cache = await store.read();
  const known = cache?.ranges[key];
  if (known) return known;
  const res = await fetch(`${RAW_URL}/${commit}/ModuleUpdate.py`, { signal: AbortSignal.timeout(FEED_TIMEOUT_MS) });
  requireOk(res, `Archipelago ${ap} ModuleUpdate.py`);
  const range = resolvePythonRange({ moduleUpdate: await res.text(), platform, ap, defaults });
  if (cache) await store.write({ ...cache, ranges: { ...cache.ranges, [key]: range } });
  return range;
};

export { readPythonRange };
