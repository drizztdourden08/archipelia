/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { EngineRuntime, Session, SessionEngine } from '@archipelia/model';
import { engineOfSession, LEGACY_ENGINE, pickHostEngine, remoteVersionWarning, sessionEngineOf } from '../src/engine';

const runtimeOf = (id: string, apVersion: string): EngineRuntime => ({
  id, apVersion, apCommit: 'c', pythonVersion: '3.12.15', root: `/e/${id}`, python: '', generate: '', multiServer: '', schemaScript: '',
});

const engine: SessionEngine = { id: 'ap-0.6.6', ap: '0.6.6', python: '3.12.14' };

describe('session engine record', () => {
  test('a session without an engine reads as 0.6.7', () => {
    expect(engineOfSession({})).toBe(LEGACY_ENGINE);
    expect(LEGACY_ENGINE.ap).toBe('0.6.7');
  });

  test('a session with an engine reads it back', () => {
    expect(engineOfSession({ engine })).toBe(engine);
  });

  test('the record is written from the runtime that generates', () => {
    expect(sessionEngineOf(runtimeOf('ap-0.6.8', '0.6.8'))).toEqual({ id: 'ap-0.6.8', ap: '0.6.8', python: '3.12.15' });
  });
});

describe('pickHostEngine', () => {
  const active = runtimeOf('ap-0.6.8', '0.6.8');
  const session: Pick<Session, 'engine'> = { engine };

  test('hosts on the session engine while it is installed', async () => {
    const own = runtimeOf('ap-0.6.6', '0.6.6');
    const asked: SessionEngine[] = [];
    const picked = await pickHostEngine({
      source: { runtime: () => Promise.resolve(active), runtimeFor: (wanted) => { asked.push(wanted); return Promise.resolve(own); } },
      session,
    });
    expect(picked).toEqual({ runtime: own });
    expect(asked).toEqual([engine]);
  });

  test('falls back to the active engine without a warning when it is not older', async () => {
    const picked = await pickHostEngine({ source: { runtime: () => Promise.resolve(active), runtimeFor: () => Promise.resolve(undefined) }, session });
    expect(picked).toEqual({ runtime: active });
  });

  test('falls back to a source without runtimeFor, and a failing lookup', async () => {
    expect((await pickHostEngine({ source: { runtime: () => Promise.resolve(active) }, session })).runtime).toBe(active);
    const failing = { runtime: () => Promise.resolve(active), runtimeFor: () => Promise.reject(new Error('gone')) };
    expect((await pickHostEngine({ source: failing, session })).runtime).toBe(active);
  });

  test('warns when the active engine is older than the one that generated the session', async () => {
    const older = runtimeOf('ap-0.6.5', '0.6.5');
    const picked = await pickHostEngine({ source: { runtime: () => Promise.resolve(older) }, session });
    expect(picked.runtime).toBe(older);
    expect(picked.warning).toMatch(/generated with Archipelago 0\.6\.6.*older Archipelago 0\.6\.5/);
  });

  test('a legacy session compares against 0.6.7', async () => {
    const older = runtimeOf('ap-0.6.5', '0.6.5');
    expect((await pickHostEngine({ source: { runtime: () => Promise.resolve(older) }, session: {} })).warning).toMatch(/Archipelago 0\.6\.7/);
    expect((await pickHostEngine({ source: { runtime: () => Promise.resolve(active) }, session: {} })).warning).toBeUndefined();
  });
});

describe('remoteVersionWarning', () => {
  test('warns for an older server only', () => {
    expect(remoteVersionWarning({ engine }, '0.6.2')).toMatch(/generated with Archipelago 0\.6\.6.*last tested with 0\.6\.2/);
    expect(remoteVersionWarning({ engine }, '0.6.6')).toBeUndefined();
    expect(remoteVersionWarning({ engine }, '0.6.8')).toBeUndefined();
    expect(remoteVersionWarning({ engine }, undefined)).toBeUndefined();
  });

  test('a legacy session compares against 0.6.7', () => {
    expect(remoteVersionWarning({}, '0.6.6')).toMatch(/Archipelago 0\.6\.7/);
  });
});
