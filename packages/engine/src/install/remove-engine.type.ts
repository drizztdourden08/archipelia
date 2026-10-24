/* @layer core @kind types */
import type { EngineStateFile } from '@archipelia/model';

type RemoveDeps = {
  state: () => Promise<EngineStateFile>;
  inUse: (id: string) => string | undefined;
  forget: (id: string) => Promise<void>;
  discard: (id: string) => Promise<void>;
  downloads: () => Promise<string[]>;
  dropDownload: (name: string) => Promise<void>;
};

export type { RemoveDeps };
