/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { GamePreset, InstalledGame, Session } from '@archipelia/model';
import { engineLine } from '../../src/views/HomeView/behavior/engine-line';
import { engineMeta } from '../../src/views/HomeView/behavior/engine-meta';
import { engineValue } from '../../src/views/HomeView/behavior/engine-value';
import { gamesMeta } from '../../src/views/HomeView/behavior/games-meta';
import { heroActions } from '../../src/views/HomeView/behavior/hero-actions';
import { heroTitle } from '../../src/views/HomeView/behavior/hero-title';
import { homeSteps } from '../../src/views/HomeView/behavior/home-steps';
import { needsEngineSetup } from '../../src/views/HomeView/behavior/needs-engine-setup';
import { newestRuns } from '../../src/views/HomeView/behavior/newest-runs';
import { presetsMeta } from '../../src/views/HomeView/behavior/presets-meta';
import { relativeTime } from '../../src/views/HomeView/behavior/relative-time';
import { sessionMeta } from '../../src/views/HomeView/behavior/session-meta';

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

const game = (name: string) => ({ game: name }) as InstalledGame;
const preset = (gameName: string) => ({ game: gameName }) as GamePreset;

const run = (id: string, createdAt: number): Session => ({
  id,
  createdAt,
  status: 'stopped',
  snapshot: {
    id: 't', name: id, updatedAt: 0,
    players: [{ slot: 1, name: 'Johnny', game: 'ALttP', source: { kind: 'yaml', fileName: 'a.yaml', yaml: '' } }],
    generator: { spoiler: 1, race: false, progressionBalancing: true },
    server: { hintCost: 10, releaseMode: 'auto', collectMode: 'auto', remainingMode: 'goal', autoShutdownMinutes: 0 },
    host: { kind: 'archipelago-gg' },
  },
});

describe('home summary', () => {
  test('engine line, value and setup need', () => {
    const ready = { state: 'ready', dir: 'x', apVersion: '0.6.7' } as const;
    expect(engineLine(ready)).toBe('Engine AP 0.6.7 ready');
    expect(engineLine({ state: 'ready', dir: 'x' })).toBe('Engine ready');
    expect(engineLine({ state: 'missing', dir: 'x' })).toBe('Engine setup needed');
    expect(engineLine(null)).toBe('Checking the engine');
    expect(engineValue(ready)).toBe('0.6.7');
    expect(engineValue({ state: 'missing', dir: 'x' })).toBe('missing');
    expect(engineMeta({ state: 'failed', dir: 'x', error: 'pip failed' })).toBe('pip failed');
    expect(needsEngineSetup({ state: 'missing', dir: 'x' })).toBe(true);
    expect(needsEngineSetup(ready)).toBe(false);
  });

  test('games and presets meta', () => {
    expect(gamesMeta([])).toBe('none installed yet');
    expect(gamesMeta(['A', 'B', 'C', 'D', 'E'].map(game))).toBe('A · B · C +2');
    expect(presetsMeta(['A', 'A', 'B'].map(preset))).toBe('across 2 games');
    expect(presetsMeta([])).toBe('across 0 games');
  });

  test('relative time and recent runs', () => {
    const now = 10 * DAY;
    expect(relativeTime(now - 10_000, now)).toBe('just now');
    expect(relativeTime(now - (5 * MINUTE), now)).toBe('5 min ago');
    expect(relativeTime(now - (3 * 60 * MINUTE), now)).toBe('3 h ago');
    expect(relativeTime(now - (2 * DAY), now)).toBe('2 d ago');
    const runs = [run('a', 1), run('b', 4), run('c', 3), run('d', 2)];
    expect(newestRuns(runs, 3).map((r) => r.id)).toEqual(['b', 'c', 'd']);
    expect(sessionMeta(run('a', now - (2 * DAY)), now)).toBe('archipelago.gg · 1 player · 2 d ago');
  });

  test('the title and the one primary action follow the next setup step', () => {
    const ready = { state: 'ready', dir: 'x', apVersion: '0.6.7' } as const;
    const fresh = homeSteps({ status: ready, installed: [], presets: [], sessions: 0 });
    expect(fresh.map((step) => [step.id, step.done])).toEqual([['engine', true], ['games', false], ['preset', false], ['session', false]]);
    expect(fresh[0]?.meta).toBe('Archipelago 0.6.7');
    const next = fresh.find((step) => !step.done) ?? null;
    expect(heroTitle(ready, next, false)).toBe('Add your first game');
    expect(heroTitle({ state: 'missing', dir: 'x' }, next, true)).toBe('Set up the engine');
    expect(heroTitle(null, next, false)).toBe('Checking the engine');
    expect(heroTitle(ready, null, false)).toBe('Run your first session');
    expect(heroTitle(ready, null, true)).toBe('Ready to host');
    const primaries = (input: Parameters<typeof heroActions>[0]) => heroActions(input).filter((action) => action.primary).map((action) => action.label);
    expect(primaries({ engineNeeded: false, next, last: null, busy: false })).toEqual(['Open Games']);
    expect(primaries({ engineNeeded: true, next, last: run('Friday', 1), busy: false })).toEqual(['Open Engine']);
    expect(primaries({ engineNeeded: false, next: null, last: run('Friday', 1), busy: false })).toEqual(['Run "Friday" again']);
    expect(heroActions({ engineNeeded: true, next, last: run('Friday', 1), busy: false }).find((action) => action.id === 'again')?.disabled).toBe(true);
  });
});
