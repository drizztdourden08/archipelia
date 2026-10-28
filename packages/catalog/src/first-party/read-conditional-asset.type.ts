/* @layer core @kind types */

type AssetRead = { kind: 'same' } | { kind: 'missing' } | { kind: 'found'; value: Record<string, unknown>; etag?: string };

type AssetReadOptions = { etag?: string | undefined; max?: number };

export type { AssetRead, AssetReadOptions };
