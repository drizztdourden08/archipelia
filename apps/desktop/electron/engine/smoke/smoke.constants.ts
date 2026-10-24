/* @layer electron-main @kind config */
import type { ServerSettings } from '@archipelia/model';

const SMOKE_DIR = 'smoke';

const SMOKE_PLAYER = 'Smoke';

const SMOKE_SEED = 1;

const SMOKE_HOST_MS = 60_000;

const SMOKE_STOP_MS = 10_000;

const SMOKE_BIND = '127.0.0.1';

const SMOKE_SERVER: ServerSettings = {
  hintCost: 10,
  releaseMode: 'auto',
  collectMode: 'auto',
  remainingMode: 'goal',
  autoShutdownMinutes: 0,
};

export { SMOKE_BIND, SMOKE_DIR, SMOKE_HOST_MS, SMOKE_PLAYER, SMOKE_SEED, SMOKE_SERVER, SMOKE_STOP_MS };
