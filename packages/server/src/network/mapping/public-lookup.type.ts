/* @layer core @kind types */

type LookupOutcome = 'skipped' | 'found' | 'failed';

type PublicLookupFetch = (url: string, init: { signal: AbortSignal }) => Promise<{ ok: boolean; text: () => Promise<string> }>;

type PublicLookupOptions = { fetch?: PublicLookupFetch; urls?: string[]; timeoutMs?: number };

type PublicLookup = { lookup: () => Promise<string | null>; outcome: () => LookupOutcome };

export type { LookupOutcome, PublicLookup, PublicLookupFetch, PublicLookupOptions };
