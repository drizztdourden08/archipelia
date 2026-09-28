/* @layer renderer-app @kind types */
import type { BaseSettings } from '@drizztdourden08/brock-core';
import type { TabRenderContext } from '@drizztdourden08/brock-react';
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

type TabContext = TabRenderContext<AppSettings>;

export type { AppSettings, TabContext };
