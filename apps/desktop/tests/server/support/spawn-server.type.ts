/* @layer tests @kind types */
type SpawnedServer = {
  lines: string[];
  waitFor: (pattern: RegExp, ms: number) => Promise<void>;
  stop: () => Promise<void>;
};

export type { SpawnedServer };
