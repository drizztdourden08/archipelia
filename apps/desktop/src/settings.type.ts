/* @layer renderer-app @kind types */
import type { BaseSettings } from '@drizztdourden08/brock-core';
import type { ReleaseMode, RemainingMode } from '@archipelia/model';

interface AppSettings extends BaseSettings {
  hostingDefaultHost: 'local' | 'archipelago-gg';
  hostingLocalPort: number;
  hostingHintCost: number;
  hostingReleaseMode: ReleaseMode;
  hostingCollectMode: ReleaseMode;
  hostingRemainingMode: RemainingMode;
  hostingAutoShutdownMinutes: number;
  ggBaseUrl: string;
}

export type { AppSettings };
