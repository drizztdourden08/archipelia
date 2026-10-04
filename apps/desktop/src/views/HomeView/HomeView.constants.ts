/* @layer renderer-app @kind config */
import type { EngineState, HostTarget } from '@archipelia/model';
import type { HeroAction, HomeStepId } from './HomeView.type';

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

const STEP_TEXT: Record<HomeStepId, { label: string; todo: string; action: string }> = {
  engine: { label: 'Engine', todo: 'Set up the engine that makes seeds and runs rooms.', action: 'Open Engine' },
  games: { label: 'Games', todo: 'Install the worlds your players play.', action: 'Open Games' },
  preset: { label: 'Preset', todo: 'Pick the options of a game once.', action: 'Open Presets' },
  session: { label: 'Session', todo: 'Add players, save, then run.', action: 'New session' },
};

const HERO_TITLE: Record<HomeStepId | 'checking' | 'building' | 'run' | 'ready', string> = {
  checking: 'Checking the engine',
  building: 'Setting up the engine',
  engine: 'Set up the engine',
  games: 'Add your first game',
  preset: 'Make your first preset',
  session: 'Build your first session',
  run: 'Run your first session',
  ready: 'Ready to host',
};

const OPEN_SESSIONS = 'Open Sessions';

const NEW_SESSION: HeroAction = { id: 'session', label: STEP_TEXT.session.action, primary: false };

const NAMED_GAMES = 3;

const MINUTE = 60_000;

const HOUR = 60 * MINUTE;

const DAY = 24 * HOUR;

const RECENT_COUNT = 3;

export { DAY, ENGINE_LINE, ENGINE_META, HERO_TITLE, HOST_LABEL, HOUR, MINUTE, NAMED_GAMES, NEW_SESSION, OPEN_SESSIONS, RECENT_COUNT, STEP_TEXT };
