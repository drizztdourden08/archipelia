/* @layer core @kind types */

type Branch = { header: string; body: string; platforms?: string[] };

type VersionLimits = { min?: string; maxExclusive?: string };

export type { Branch, VersionLimits };
