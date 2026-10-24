/* @layer electron-main @kind types */
import type { StartJob } from '@drizztdourden08/brock-electron/main';
import type { FeedMode, FeedStore, FetchLike } from '@archipelia/engine';
import type { DataFiles, EngineEvent, EngineStateFile, PythonRange, Session, VersionFeed } from '@archipelia/model';

type EngineEnv = {
  root: string;
  games: DataFiles;
  size: (id: string) => Promise<number>;
  feedStore: FeedStore;
  fetch: FetchLike;
  target: string;
  platform: string;
  startJob: StartJob;
  emit: (event: EngineEvent) => void;
  sessions: () => Promise<Session[]>;
  inUse: (id: string) => string | undefined;
};

type VersionSource = {
  feed: (mode: FeedMode) => Promise<VersionFeed>;
  rangeOf: (ap: string, ref: string) => Promise<PythonRange>;
  ranges: (feed: VersionFeed) => Promise<Record<string, PythonRange>>;
  commitOf: (ap: string, state: EngineStateFile) => Promise<string>;
};

export type { EngineEnv, VersionSource };
