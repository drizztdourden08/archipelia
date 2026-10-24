/* @layer core @kind logic */
import { parseRegistry } from './parse-registry';
import { REGISTRY_FETCH_TIMEOUT_MS, REGISTRY_URL } from './registry.constants';
import { MAX_REGISTRY_BYTES } from './fetch-registry.constants';
import type { RegistryFetch } from './load-registry.type';

const fetchRegistry = async (fetchFn: typeof fetch, etag: string | null, url = REGISTRY_URL): Promise<RegistryFetch> => {
  const headers: Record<string, string> = { accept: 'application/json' };
  if (etag !== null) headers['if-none-match'] = etag;
  const res = await fetchFn(url, { headers, signal: AbortSignal.timeout(REGISTRY_FETCH_TIMEOUT_MS) });
  if (res.status === 304 && etag !== null) return { kind: 'same' };
  if (!res.ok) throw new Error(`registry: HTTP ${res.status}`);
  const text = await res.text();
  if (text.length > MAX_REGISTRY_BYTES) throw new Error('registry: the file is too large');
  const raw: unknown = JSON.parse(text);
  const parsed = parseRegistry(raw);
  if (!parsed.ok) throw new Error(`registry: ${parsed.problems.join('; ')}`);
  return { kind: 'fresh', registry: parsed.registry, raw, etag: res.headers.get('etag') };
};

export { fetchRegistry };
