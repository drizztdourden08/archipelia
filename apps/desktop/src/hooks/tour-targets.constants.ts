/* @layer renderer-app @kind config */
const NEW_PRESET_TOUR = 'new-preset';

const NEW_PRESET = { tour: NEW_PRESET_TOUR } as const;

const TOUR_TARGET = {
  homeAside: 'home-aside',
  sessionsList: 'sessions-list',
  sessionsRuns: 'sessions-runs',
  sessionsJoin: 'sessions-join',
  gamesTools: 'game-store-tools',
  gamesGrid: 'games-grid',
  presetsOptions: 'presets-options',
  builderBar: 'builder-bar',
  serversDetail: 'servers-detail',
  engineStatus: 'engine-status',
  engineVersions: 'engine-versions',
} as const;

const TOUR_ROUTE = {
  home: 'multiworld',
  machines: 'multiworld/servers/machines',
  hosting: 'multiworld/hosting',
  archipelagoGg: 'multiworld/archipelago-gg',
  general: 'multiworld/general',
  storage: 'multiworld/storage',
  oldRuns: 'multiworld/old-runs',
} as const;

const SCREEN_LAYER = '.screen-layer:not(.screen-layer--hidden)';

const TOUR_PART = {
  page: { selector: `${SCREEN_LAYER} :is(.screen-page, .hub-bare-page, .hero)` },
  rail: { selector: `${SCREEN_LAYER} .side-nav` },
  tabs: { selector: `${SCREEN_LAYER} .settings-page__tabs` },
  gamesStatus: { selector: 'section[aria-label="Games status"]' },
} as const;

export { NEW_PRESET, NEW_PRESET_TOUR, TOUR_PART, TOUR_ROUTE, TOUR_TARGET };
