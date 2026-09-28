/* @layer renderer-app @kind logic */
import type { AppSettings } from '../../../settings.type';
import type { HostingDefaults } from '../SessionBuilder.type';

const hostingDefaults = (settings: AppSettings): HostingDefaults => ({
  defaultHost: settings.hostingDefaultHost,
  localPort: settings.hostingLocalPort,
  ggBaseUrl: settings.ggBaseUrl,
  server: {
    hintCost: settings.hostingHintCost,
    releaseMode: settings.hostingReleaseMode,
    collectMode: settings.hostingCollectMode,
    remainingMode: settings.hostingRemainingMode,
    autoShutdownMinutes: settings.hostingAutoShutdownMinutes,
  },
});

export { hostingDefaults };
