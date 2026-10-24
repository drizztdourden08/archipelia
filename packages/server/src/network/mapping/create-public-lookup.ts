/* @layer core @kind logic */
import { isUsableAddress } from '../address/is-usable-address';
import { PUBLIC_LOOKUP_TIMEOUT_MS, PUBLIC_LOOKUP_URLS } from './mapping.constants';
import type { LookupOutcome, PublicLookup, PublicLookupFetch, PublicLookupOptions } from './public-lookup.type';

const ask = async (fetcher: PublicLookupFetch, url: string, timeoutMs: number): Promise<string | null> => {
  try {
    const response = await fetcher(url, { signal: AbortSignal.timeout(timeoutMs) });
    const text = response.ok ? (await response.text()).trim() : '';
    return isUsableAddress(text) ? text : null;
  } catch {
    return null;
  }
};

const createPublicLookup = (options: PublicLookupOptions = {}): PublicLookup => {
  const fetcher = options.fetch ?? ((url, init) => fetch(url, init));
  const urls = options.urls ?? PUBLIC_LOOKUP_URLS;
  let outcome: LookupOutcome = 'skipped';
  const lookup = async () => {
    for (const url of urls) {
      const found = await ask(fetcher, url, options.timeoutMs ?? PUBLIC_LOOKUP_TIMEOUT_MS);
      if (found) {
        outcome = 'found';
        return found;
      }
    }
    outcome = 'failed';
    return null;
  };
  return { lookup, outcome: () => outcome };
};

export { createPublicLookup };
