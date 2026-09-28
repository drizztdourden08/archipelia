/* @layer tests @kind logic */
import { optionDef } from '@archipelia/model';
import type { GamePreset, InstalledGame, SessionPlayer, SessionTemplate } from '@archipelia/model';

const option = (seed: Parameters<typeof optionDef>[0]) => optionDef({ visibility: ['simple'], ...seed });

const GAME: InstalledGame = {
  apworld: 'demo', game: 'Demo', version: '1.0.0', source: 'index', installedAt: 0,
  sha256: '', verified: false, layout: 'apworld', path: 'worlds/demo.apworld', requires: [],
  schema: {
    game: 'Demo', worldVersion: '1.0.0', groups: ['Game Options'], presets: {},
    options: [
      option({ key: 'death_link', kind: 'toggle', default: false }),
      option({ key: 'crystals', kind: 'range', default: 7, range: { min: 0, max: 7 } }),
      option({ key: 'goal', kind: 'choice', default: 'ganon', choices: [{ value: 'ganon', label: 'Ganon' }, { value: 'pedestal', label: 'Pedestal' }] }),
    ],
  },
};

const PRESET: GamePreset = { id: 'p1', game: 'Demo', name: 'Open', values: { crystals: 5 }, updatedAt: 0 };

const presetPlayer = (slot: number, name: string, presetId = 'p1', game = 'Demo'): SessionPlayer => ({
  slot, name, game, source: { kind: 'preset', presetId, overrides: {} },
});

const templateOf = (patch: Partial<SessionTemplate> = {}): SessionTemplate => ({
  id: 't', name: 'Session', updatedAt: 0, players: [],
  generator: { spoiler: 1, race: false, progressionBalancing: true },
  server: { hintCost: 10, releaseMode: 'auto', collectMode: 'auto', remainingMode: 'goal', autoShutdownMinutes: 0 },
  host: { kind: 'local', port: 38281 },
  ...patch,
});

export { GAME, PRESET, presetPlayer, templateOf };
