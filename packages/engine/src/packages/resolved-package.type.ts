/* @layer core @kind types */

type ResolvedPackage = { name: string; version: string; pin: string; url: string; direct: boolean; sha256?: string };

export type { ResolvedPackage };
