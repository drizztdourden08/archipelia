/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { PYTHON_LATEST_URL } from './feed-sources.constants';
import type { FetchLike } from './fetch-like.type';
import type { PythonBuildsOutcome } from './fetch-python-builds.type';
import { parsePythonBuilds } from './parse-python-builds';
import { requireOk } from './require-ok';

const fetchPythonBuilds = async (fetchUrl: FetchLike, target: string): Promise<PythonBuildsOutcome> => {
  const latest = await fetchUrl(PYTHON_LATEST_URL);
  requireOk(latest, 'Python build list');
  const info = await latest.json();
  if (!isRecord(info) || typeof info.tag !== 'string' || typeof info.asset_url_prefix !== 'string') {
    throw new Error('Python build list: unexpected shape');
  }
  const sums = await fetchUrl(`${info.asset_url_prefix}/SHA256SUMS`);
  requireOk(sums, 'Python checksums');
  return { release: info.tag, builds: parsePythonBuilds(await sums.text(), info.tag, target) };
};

export { fetchPythonBuilds };
