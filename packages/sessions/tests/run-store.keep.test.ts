/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { Session, SessionTemplate } from '@archipelia/model';
import { createRunStore } from '../src/store/create-run-store';
import { runFiles } from './run-files';

const SNAPSHOT: SessionTemplate = {
  id: 'sunday', name: 'Sunday run', updatedAt: 0, players: [{ kind: 'set', slot: 1, name: 'Drizzt', game: 'Celeste', source: { kind: 'preset', presetId: '', overrides: {} } }],
  generator: { spoiler: 3, race: false, progressionBalancing: true },
  server: { hintCost: 10, releaseMode: 'auto', collectMode: 'auto', remainingMode: 'goal', autoShutdownMinutes: 0 },
  host: { kind: 'local', port: 38281 },
};

const OLD_RUN: Session = { id: 'r1', templateId: 'sunday', snapshot: SNAPSHOT, status: 'stopped', createdAt: 5 };

describe('K3 the run store', { tags: ['critical'] }, () => {
  test('reads an old run with its source and players, and leaves the file as it was', async () => {
    const stored: Record<string, unknown> = { 'runs/r1.json': OLD_RUN };
    const store = createRunStore(runFiles(stored), () => Promise.resolve([SNAPSHOT]));
    expect((await store.get('r1'))?.source).toMatchObject({ sessionId: 'sunday', match: 'recorded' });
    expect((await store.list())[0]?.players).toEqual([{ slot: 1, name: 'Drizzt', game: 'Celeste' }]);
    expect(stored['runs/r1.json']).toBe(OLD_RUN);
  });

  test('has an unknown source without a saved session to match', async () => {
    const store = createRunStore(runFiles({ 'runs/r1.json': OLD_RUN }));
    expect((await store.newest())[0]?.source?.match).toBe('unknown');
  });
});
