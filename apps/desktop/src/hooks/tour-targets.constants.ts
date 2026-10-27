/* @layer renderer-app @kind config */
const NEW_PRESET_TOUR = 'new-preset';

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
  games: 'multiworld/games/all',
  hosting: 'multiworld/hosting',
} as const;

const TOUR_SCOPE = {
  sessions: 'multiworld/sessions',
  games: 'multiworld/games',
  presets: 'multiworld/presets',
  servers: 'multiworld/servers',
  hosting: 'multiworld/hosting',
} as const;

const SCREEN_LAYER = '.screen-layer:not(.screen-layer--hidden)';

const RAIL_ENTRY = `${SCREEN_LAYER} nav.side-nav .side-nav__item`;

const TOUR_RAIL = {
  sessions: { selector: `${RAIL_ENTRY}[aria-label="Sessions"]` },
  games: { selector: `${RAIL_ENTRY}[aria-label="Games"]` },
  presets: { selector: `${RAIL_ENTRY}[aria-label="Presets"]` },
  servers: { selector: `${RAIL_ENTRY}[aria-label="Servers"]` },
  hosting: { selector: `${RAIL_ENTRY}[aria-label="Hosting"]` },
  engine: { selector: `${RAIL_ENTRY}[aria-label="Engine"]` },
} as const;

const TOUR_PART = {
  menuPanel: { selector: '[role="menu"]:not(.dropdown-menu--sub)' },
  newSession: { selector: `${SCREEN_LAYER} .header-actions .btn--primary` },
  back: { selector: `${SCREEN_LAYER} .content-header__back` },
  page: { selector: `${SCREEN_LAYER} :is(.screen-page, .hub-bare-page, .hero)` },
  rail: { selector: `${SCREEN_LAYER} nav.side-nav` },
  hero: { shell: 'hero' },
  tabs: { shell: 'tabs' },
  gamesStatus: { selector: 'section[aria-label="Games status"]' },
} as const;

export { NEW_PRESET_TOUR, TOUR_PART, TOUR_RAIL, TOUR_ROUTE, TOUR_SCOPE, TOUR_TARGET };
