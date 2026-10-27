/* @layer renderer-app @kind config */
const NEW_PRESET_TOUR = 'new-preset';

const TOUR_TARGET = {
  homeAside: 'home-aside',
  sessionsList: 'sessions-list',
  historyList: 'history-list',
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

const SCREEN_LAYER = '.screen-layer:not(.screen-layer--hidden)';

const TOUR_RAIL = {
  sessions: { shell: 'rail', entry: 'Sessions' },
  games: { shell: 'rail', entry: 'Games' },
  presets: { shell: 'rail', entry: 'Presets' },
  servers: { shell: 'rail', entry: 'Servers' },
  hosting: { shell: 'rail', entry: 'Hosting' },
  engine: { shell: 'rail', entry: 'Engine' },
} as const;

const TOUR_PART = {
  menuPanel: { shell: 'menu-panel' },
  menuHome: { menuEntry: 'Home' },
  newSession: { shell: 'primary' },
  back: { shell: 'back' },
  page: { selector: `${SCREEN_LAYER} :is(.screen-page, .hub-bare-page, .hero)` },
  rail: { shell: 'rail' },
  hero: { shell: 'hero' },
  tabs: { shell: 'tabs' },
} as const;

export { NEW_PRESET_TOUR, TOUR_PART, TOUR_RAIL, TOUR_ROUTE, TOUR_TARGET };
