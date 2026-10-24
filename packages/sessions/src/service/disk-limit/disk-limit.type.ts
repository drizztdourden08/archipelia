/* @layer core @kind types */

type DiskLimit = { bytes: number; extraDirs: string[]; intervalMs?: number };

type DiskWatch = {
  signal: AbortSignal | undefined;
  failure: () => Error | undefined;
  check: () => Promise<void>;
  stop: () => void;
};

export type { DiskLimit, DiskWatch };
