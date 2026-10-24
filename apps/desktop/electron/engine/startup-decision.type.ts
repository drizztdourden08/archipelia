/* @layer electron-main @kind types */
import type { ApRelease, EngineStateFile, PythonRange, VersionFeed } from '@archipelia/model';

type StartupInput = {
  state: EngineStateFile;
  feed: VersionFeed;
  target: string;
  rangeOf: (release: ApRelease) => Promise<PythonRange>;
};

export type { StartupInput };
