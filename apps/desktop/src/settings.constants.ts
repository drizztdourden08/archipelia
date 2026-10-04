/* @layer renderer-app @kind config */
import { DEFAULT_BASE_SETTINGS } from '@drizztdourden08/brock-core';
import type { Section, TabDef } from '@drizztdourden08/brock-react';
import type { AppSettings } from './settings.type';
import { renderEngineTab } from './settings-tabs/EngineTab';
import { renderGgTab } from './settings-tabs/GgTab';
import { renderHostingTab } from './settings-tabs/HostingTab';

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

const BASE_SECTIONS: Section[] = [
  {
    id: 'window',
    title: 'Window',
    items: [
      { key: 'windowMode', label: 'Window mode', description: 'Windowed, borderless or fullscreen.', control: { kind: 'choice', options: [{ value: 'windowed', label: 'Windowed' }, { value: 'borderless', label: 'Borderless' }, { value: 'fullscreen', label: 'Fullscreen' }] } },
      { key: 'startFullscreen', label: 'Start fullscreen', description: 'Open in fullscreen on launch.' },
    ],
  },
  {
    id: 'developer',
    title: 'Developer',
    items: [
      { key: 'developerToolsEnabled', label: 'Developer tools', description: 'Allow opening the developer tools.' },
      { key: 'allowDebugLogging', label: 'Debug logging', description: 'Write debug lines to the session log.' },
    ],
  },
];

const SETTINGS_TABS: TabDef<AppSettings>[] = [
  { id: 'general', label: 'General', navIcon: 'G', group: 'App', sections: () => BASE_SECTIONS },
  { id: 'engine', label: 'Engine', navIcon: 'E', group: 'App', render: renderEngineTab },
  { id: 'hosting', label: 'Hosting', navIcon: 'H', group: 'Sessions', render: renderHostingTab },
  { id: 'archipelago-gg', label: 'archipelago.gg', navIcon: 'A', group: 'Sessions', render: renderGgTab },
];

export { DEFAULT_SETTINGS, SETTINGS_TABS };
