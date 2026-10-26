/* @layer core @kind types */

type MarkerToken = { kind: 'open' | 'close' | 'string' | 'op' | 'word'; text: string };

export type { MarkerToken };
