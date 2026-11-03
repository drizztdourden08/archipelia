/* @layer tests @kind fixture */
import type { SessionTemplate } from '@archipelia/model';

const SNAPSHOT: SessionTemplate = {
  id: 'sunday', name: 'Sunday run', updatedAt: 0, players: [{ kind: 'set', slot: 1, name: 'Drizzt', game: 'Celeste', source: { kind: 'preset', presetId: '', overrides: {} } }],
  generator: { spoiler: 3, race: false, progressionBalancing: true },
  server: { hintCost: 10, releaseMode: 'auto', collectMode: 'auto', remainingMode: 'goal', autoShutdownMinutes: 0 },
  host: { kind: 'local', port: 38281 },
};

export { SNAPSHOT };
