/* @layer tests @kind test */
import { describe, expect, test, vi } from 'vitest';
import type { EngineStatus, StartupDecision } from '@archipelia/model';
import type { EngineStartupDeps } from '../../src/hooks/engine-startup/engine-startup.type';
import { runEngineStartup } from '../../src/hooks/engine-startup/run-engine-startup';
import { feedOf } from './engine-fixture';
import { broken, ctxOf, depsOf, fresh, installed, ready, withOffer } from './engine-startup-fixture';

const quiet = (status: EngineStatus): Partial<EngineStartupDeps> => ({
  status: vi.fn(() => Promise.resolve(status)),
  startup: vi.fn(() => Promise.resolve<StartupDecision>({ kind: 'none' })),
});

describe('running the first run prompt', () => {
  test('installs the release picked in the select', async () => {
    const { ctx, choices } = ctxOf(true, { choice: '0.6.2' });
    const { deps, calls } = depsOf();
    await runEngineStartup(ctx, deps);
    expect(choices).toHaveLength(1);
    expect(calls).toEqual(['install 0.6.2 3.12.15']);
    expect(deps.finish).toHaveBeenCalledWith(installed, expect.objectContaining({ ap: '0.6.2' }));
  });

  test('installs the preselected latest release when Install is pressed', async () => {
    const { ctx } = ctxOf(true);
    const { deps, calls } = depsOf();
    await runEngineStartup(ctx, deps);
    expect(calls).toEqual(['install 0.6.8 3.12.15']);
  });

  test('Not now installs nothing', async () => {
    const { ctx } = ctxOf(true, { choice: null });
    const { deps, calls } = depsOf();
    await runEngineStartup(ctx, deps);
    expect(calls).toEqual([]);
    expect(deps.finish).not.toHaveBeenCalled();
  });

  test('with no release list it asks plainly and installs the default', async () => {
    const { ctx, choices, actions } = ctxOf(true, { action: true });
    const { deps, calls } = depsOf({ overview: vi.fn(() => Promise.reject(new Error('offline'))) });
    await runEngineStartup(ctx, deps);
    expect(choices).toHaveLength(0);
    expect(actions).toHaveLength(1);
    expect(calls).toEqual(['install 0.6.8 3.12.15']);
  });

  test('a release no Python fits tells the owner and installs nothing', async () => {
    const none = { ...fresh, feed: feedOf({ python: [] }) };
    const { ctx } = ctxOf(true, { choice: '0.6.2' });
    const { deps, calls } = depsOf({ overview: vi.fn(() => Promise.resolve(none)) });
    await runEngineStartup(ctx, deps);
    expect(calls).toEqual([]);
    expect(deps.tell).toHaveBeenCalledTimes(1);
  });
});

describe('running the upgrade offer prompt', () => {
  test('the offer is marked shown before the answer and installs on Upgrade', async () => {
    const { ctx, actions } = ctxOf(true, { action: true });
    const { deps, calls } = depsOf(withOffer());
    await runEngineStartup(ctx, deps);
    expect(actions[0]?.title).toBe('Archipelago 0.6.8 is out');
    expect(calls).toEqual(['offerShown 0.6.8', 'install 0.6.8 3.12.15']);
  });

  test('a declined offer is still marked shown and installs nothing', async () => {
    const { ctx } = ctxOf(true, { action: false });
    const { deps, calls } = depsOf(withOffer());
    await runEngineStartup(ctx, deps);
    expect(calls).toEqual(['offerShown 0.6.8']);
  });

  test('nothing to offer shows nothing', async () => {
    const { ctx, choices, actions } = ctxOf(true, { action: true });
    const { deps, calls } = depsOf(quiet(ready));
    await runEngineStartup(ctx, deps);
    expect(choices.length + actions.length).toBe(0);
    expect(calls).toEqual([]);
  });
});

describe('running the prompt with the check at start off', () => {
  test('a ready engine never asks main or shows a dialog', async () => {
    const { ctx, choices, actions } = ctxOf(false, { action: true });
    const { deps, calls } = depsOf(withOffer());
    await runEngineStartup(ctx, deps);
    expect(deps.startup).not.toHaveBeenCalled();
    expect(choices.length + actions.length).toBe(0);
    expect(calls).toEqual([]);
  });

  test('a broken engine does not use up an offer', async () => {
    const { ctx, actions } = ctxOf(false, { action: true });
    const { deps, calls } = depsOf(withOffer(broken));
    await runEngineStartup(ctx, deps);
    expect(actions).toHaveLength(0);
    expect(calls).toEqual([]);
  });

  test('a missing engine is still set up', async () => {
    const { ctx } = ctxOf(false);
    const { deps, calls } = depsOf();
    await runEngineStartup(ctx, deps);
    expect(calls).toEqual(['install 0.6.8 3.12.15']);
  });
});
