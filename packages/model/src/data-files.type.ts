/* @layer core @kind types */
type DataEntry = { name: string; isDirectory: boolean };

type DataFiles = {
  path: (rel?: string) => string;
  exists: (rel: string) => Promise<boolean>;
  readJson: <T>(rel: string, fallback: T) => Promise<T>;
  writeJson: (rel: string, value: unknown) => Promise<void>;
  readText: (rel: string) => Promise<string | null>;
  writeText: (rel: string, text: string) => Promise<void>;
  readBytes: (rel: string) => Promise<Uint8Array | null>;
  writeBytes: (rel: string, data: Uint8Array) => Promise<void>;
  list: (dir?: string) => Promise<DataEntry[]>;
  remove: (rel: string) => Promise<void>;
};

export type { DataEntry, DataFiles };
