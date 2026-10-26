/* @layer core @kind logic */
import type { SourcePypi } from '@archipelia/model';
import { isRecord } from '@archipelia/model';
import type { GithubRepo } from '../enrich/enrich.type';
import { PYPI_JSON, PYPI_TIMEOUT_MS } from '../install/missing-on-pypi.constants';
import { githubReposIn } from './github-repos-in';

const addressesOf = (info: Record<string, unknown>): string => {
  const urls = isRecord(info.project_urls) ? Object.values(info.project_urls) : [];
  return [info.home_page, info.download_url, ...urls].filter((value): value is string => typeof value === 'string').join(' ');
};

const pointsAt = (info: Record<string, unknown>, repo: GithubRepo) =>
  githubReposIn(addressesOf(info)).some((found) => `${found.owner}/${found.repo}`.toLowerCase() === `${repo.owner}/${repo.repo}`.toLowerCase());

const pypiOffer = async (name: string, repo: GithubRepo, lookup: typeof fetch): Promise<SourcePypi | undefined> => {
  try {
    const res = await lookup(`${PYPI_JSON}/${encodeURIComponent(name)}/json`, { signal: AbortSignal.timeout(PYPI_TIMEOUT_MS) });
    if (!res.ok) {
      await res.body?.cancel();
      return undefined;
    }
    const body: unknown = await res.json();
    const info = isRecord(body) && isRecord(body.info) ? body.info : undefined;
    if (!info || typeof info.name !== 'string' || typeof info.version !== 'string') return undefined;
    return { name: info.name, version: info.version, linked: pointsAt(info, repo) };
  } catch {
    return undefined;
  }
};

export { pypiOffer };
