/* @layer core @kind types */

type Fetch = typeof fetch;

type DownloadedWorld = { file: string; dispose: () => Promise<void> };

export type { DownloadedWorld, Fetch };
