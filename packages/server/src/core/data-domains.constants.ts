/* @layer core @kind config */
import type { DataDomainDef } from '@drizztdourden08/brock-core/platform';
import { DOMAIN } from '@archipelia/model';

const DATA_DOMAINS: DataDomainDef[] = [
  { domain: DOMAIN.sessions, label: 'Sessions', dir: 'sessions', description: 'The saved sessions, the list of runs and the files of each run.', clearable: false },
  { domain: DOMAIN.presets, label: 'Presets', dir: 'presets', description: 'The option presets of each game.' },
  { domain: DOMAIN.servers, label: 'Saved servers', dir: 'servers', description: 'The remote servers sessions can host on.' },
  { domain: DOMAIN.games, label: 'Installed games', dir: 'games', description: 'What is known of each installed world; the worlds themselves live in the engine.', clearable: false, portable: false },
  { domain: DOMAIN.engine, label: 'Engine', dir: 'engine', description: 'The private Python and Archipelago. Rebuild it from the Engine page.', clearable: false, portable: false },
  { domain: DOMAIN.cache, label: 'Catalog cache', dir: 'cache', description: 'The downloaded games index, fetched again when it is cleared.', portable: false },
  { domain: DOMAIN.lobbies, label: 'Lobbies', dir: 'lobbies', description: 'The open lobbies, their members and the files players sent.', clearable: false, portable: false },
  { domain: DOMAIN.server, label: 'Server', dir: 'server', description: 'The lobby server settings and its admin token.', clearable: false, portable: false },
  { domain: DOMAIN.lobbyServers, label: 'Archipelia servers', dir: 'lobby-servers', description: 'The remote Archipelia servers whose lobbies this app manages. Their admin tokens stay in the vault.', portable: false },
];

export { DATA_DOMAINS };
