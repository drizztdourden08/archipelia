/* @layer renderer-app @kind config */
import type { EngineState, HostTarget } from '@archipelia/model';

const HOST_LABEL: Record<HostTarget['kind'], string> = { local: 'hosted locally', 'archipelago-gg': 'archipelago.gg', remote: 'remote host' };

const ENGINE_META: Record<EngineState, string> = {
  ready: 'ready to generate and host',
  missing: 'not installed yet',
  building: 'setting up',
  failed: 'setup failed',
};

const HEADLINE: Record<EngineState, string> = {
  ready: 'Good to go',
  missing: 'Set up the engine first',
  building: 'The engine is being set up',
  failed: 'The engine setup failed',
};

const NAMED_GAMES = 3;

const MINUTE = 60_000;

const HOUR = 60 * MINUTE;

const DAY = 24 * HOUR;

const CARD_MIN_COL = 200;

const RECENT_COUNT = 3;

export { CARD_MIN_COL, DAY, ENGINE_META, HEADLINE, HOST_LABEL, HOUR, MINUTE, NAMED_GAMES, RECENT_COUNT };
