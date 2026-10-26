/* @layer core @kind logic */
import { PYPI_JSON, PYPI_TIMEOUT_MS } from './missing-on-pypi.constants';

const isGone = async (name: string, lookup: typeof fetch): Promise<boolean> => {
  try {
    const res = await lookup(`${PYPI_JSON}/${encodeURIComponent(name)}/json`, { signal: AbortSignal.timeout(PYPI_TIMEOUT_MS) });
    await res.body?.cancel();
    return res.status === 404;
  } catch {
    return false;
  }
};

const missingOnPypi = async (names: string[]): Promise<string[]> => {
  const gone = await Promise.all(names.map((name) => isGone(name, fetch)));
  return names.filter((_name, at) => gone[at]);
};

export { missingOnPypi };
