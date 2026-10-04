/* @layer renderer-app @kind config */
import { DEFAULT_BASE_SETTINGS } from '@drizztdourden08/brock-core';
import type { AppSettings } from './settings.type';

const DEFAULT_SETTINGS: AppSettings = {
  ...DEFAULT_BASE_SETTINGS,
  hostingDefaultHost: 'local',
  hostingLocalPort: 38281,
  hostingHintCost: 10,
  hostingReleaseMode: 'auto',
  hostingCollectMode: 'auto',
  hostingRemainingMode: 'goal',
  hostingAutoShutdownMinutes: 0,
  ggBaseUrl: 'https://archipelago.gg',
};

export { DEFAULT_SETTINGS };
