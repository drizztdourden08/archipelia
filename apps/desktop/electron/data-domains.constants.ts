/* @layer electron-main @kind config */
import type { DataDomainDef } from '@drizztdourden08/brock-core/platform';

const DATA_DOMAINS: DataDomainDef[] = [
  { domain: 'sessions', label: 'Sessions', dir: 'sessions' },
  { domain: 'presets', label: 'Presets', dir: 'presets' },
  { domain: 'games', label: 'Installed games', dir: 'games' },
  { domain: 'engine', label: 'Engine', dir: 'engine' },
  { domain: 'cache', label: 'Catalog cache', dir: 'cache' },
];

export { DATA_DOMAINS };
