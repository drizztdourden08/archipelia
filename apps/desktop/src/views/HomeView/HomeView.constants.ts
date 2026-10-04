/* @layer renderer-app @kind config */
import type { EngineState, HostTarget } from '@archipelia/model';

const HOST_LABEL: Record<HostTarget['kind'], string> = { local: 'hosted locally', 'archipelago-gg': 'archipelago.gg', remote: 'remote host' };

const ENGINE_META: Record<EngineState, string> = {
  ready: 'ready to generate and host',
  missing: 'not installed yet',
  building: 'setting up',
  failed: 'setup failed',
};

const ENGINE_LINE: Record<EngineState, string> = {
  ready: 'Engine ready',
  missing: 'Engine setup needed',
  building: 'Engine setting up',
  failed: 'Engine setup failed',
};

const HERO_TITLE = 'Multiworld';

const NAMED_GAMES = 3;

const MINUTE = 60_000;

const HOUR = 60 * MINUTE;

const DAY = 24 * HOUR;

const RECENT_COUNT = 3;

export { DAY, ENGINE_LINE, ENGINE_META, HERO_TITLE, HOST_LABEL, HOUR, MINUTE, NAMED_GAMES, RECENT_COUNT };
