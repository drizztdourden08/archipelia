/* @layer tests @kind helper */
import { join } from 'node:path';
import { expect } from 'vitest';
import type { Client } from 'archipelago.js';
import { engineLeftovers } from '../../app/support/engine-cleanup';
import { launchApp } from '../../app/support/launch-app';
import type { LaunchedApp } from '../../app/support/launched-app.type';
import { tearDown } from '../../app/support/safety-net';
import type { SessionDirs } from '../steps/session-dirs.type';
import { stopRotp } from './rotp-instance';
import type { RotpInstance } from './rotp-instance';
import { SESSION_PROOF_DIR } from './session-constants';
import { sessionEnv } from './session-env';
import type { SessionEnv } from './session-env';

type SessionState = { launched?: LaunchedApp; dirs?: SessionDirs; env?: SessionEnv; rotp: RotpInstance[]; clients: Client[] };

const sessionState = () => {
  const state: SessionState = { rotp: [], clients: [] };
  const app = () => {
    if (!state.launched) throw new Error('the app did not launch');
    return state.launched;
  };
  const env = () => {
    if (!state.env) throw new Error('the session env is not read');
    return state.env;
  };
  const dirs = () => {
    if (!state.dirs) throw new Error('the RotP folders are not made');
    return state.dirs;
  };
  const rotpOf = (name: string) => {
    const found = state.rotp.find((instance) => instance.name === name);
    if (!found) throw new Error(`${name} was not started`);
    return found;
  };
  const tabOf = () => app().page.locator('.session-tabs__body');
  const start = async () => {
    state.env = sessionEnv();
    state.dirs = { logs: join(SESSION_PROOF_DIR, 'rotp') };
    expect(await engineLeftovers(), 'the shared engine must start clean').toEqual([]);
    state.launched = await launchApp(SESSION_PROOF_DIR);
  };
  const stop = async () => {
    await Promise.all(state.rotp.map((instance) => stopRotp(instance)));
    const notes = await tearDown(state.launched, state.clients);
    expect(await engineLeftovers()).toEqual([]);
    expect(notes, 'teardown notes').toEqual([]);
  };
  return { state, app, env, dirs, rotpOf, tabOf, start, stop };
};

export { sessionState };
