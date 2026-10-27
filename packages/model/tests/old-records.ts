/* @layer tests @kind logic */
import type { SessionPlayer, SessionTemplate, StoredRun, StoredTemplate } from '../src';

const ENGINE_SETTINGS = {
  generator: { spoiler: 3, race: false, progressionBalancing: true },
  server: { hintCost: 10, releaseMode: 'auto', collectMode: 'auto', remainingMode: 'goal', autoShutdownMinutes: 0 },
} as const;

const preset = (slot: number, name: string, game: string): SessionPlayer => ({
  slot, name, game, source: { kind: 'preset', presetId: 'easy', overrides: { crystals: 5 } },
});

const template = (patch: Partial<SessionTemplate> = {}): SessionTemplate => ({
  id: 'sunday', name: 'Sunday run', updatedAt: 1000, players: [preset(1, 'Drizzt', 'Hollow Knight'), preset(2, 'Alice', 'Celeste')],
  host: { kind: 'local', port: 38281 }, ...ENGINE_SETTINGS, ...patch,
});

const storedPlayers = (players: SessionPlayer[]): SessionPlayer[] => players.map(({ slot, name, game, source }) => ({ slot, name, game, source }));

const beforeTheSplit = (): StoredTemplate => ({ ...template(), players: storedPlayers(template().players), lan: true });

const withLegacyDirect = (): StoredTemplate => ({
  ...beforeTheSplit(),
  direct: { serverId: 'r1', lobbyId: 'lb_1', admission: 'host-approval', allowUnlisted: false },
});

const oldRun = (patch: Partial<StoredRun> = {}): StoredRun => ({
  id: 'run1', templateId: 'sunday', snapshot: beforeTheSplit(), status: 'stopped', createdAt: 2000, seed: '48213', ...patch,
});

export { oldRun, preset, template, withLegacyDirect, beforeTheSplit };
