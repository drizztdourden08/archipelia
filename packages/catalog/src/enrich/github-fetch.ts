/* @layer core @kind logic */
import { FETCH_TIMEOUT_MS } from './enrich.constants';

const githubFetch = (fetchFn: typeof fetch, url: string, headers: Record<string, string> = {}): Promise<Response> =>
  fetchFn(url, { headers, redirect: 'follow', signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });

export { githubFetch };
