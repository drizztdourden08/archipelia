/* @layer tests @kind test */
import { vi } from 'vitest';
import type { ConfirmActionOptions, ConfirmChoiceOptions } from '@drizztdourden08/brock-react';
import type { EngineChoice, EngineInstallResult, EngineOverview, EngineStatus, StartupDecision } from '@archipelia/model';
import type { EngineStartupDeps, OfferDecision, StartupCtx } from '../../src/hooks/engine-startup/engine-startup.type';
import { DEFAULT_SETTINGS } from '../../src/settings.constants';
import { overviewOf } from './engine-fixture';

const latest: EngineChoice = { ap: '0.6.8', python: '3.12.15', pythonRelease: '20261021' };
const first: StartupDecision = { kind: 'first-run', choice: latest };
const offer: OfferDecision = { kind: 'offer', from: '0.6.7', to: '0.6.8', notesUrl: 'https://example.test/0.6.8', choice: latest };
const ready: EngineStatus = { state: 'ready', apVersion: '0.6.7', dir: 'C:/engine' };
const missing: EngineStatus = { state: 'missing', dir: 'C:/engine' };
const broken: EngineStatus = { state: 'failed', dir: 'C:/engine' };
const fresh = overviewOf({ active: undefined, installed: [], status: missing });
const installed: EngineInstallResult = { outcome: 'switched', id: 'ap-0.6.8_py-3.12.15_win32-x64' };

type Answers = { choice?: string | null; action?: boolean };

const ctxOf = (checkAtStart: boolean, answers: Answers = {}) => {
  const choices: ConfirmChoiceOptions<string>[] = [];
  const actions: ConfirmActionOptions[] = [];
  const ctx: StartupCtx = {
    settings: { get: () => ({ ...DEFAULT_SETTINGS, engineCheckAtStart: checkAtStart }) },
    confirmAction: (options) => {
      actions.push(options);
      return Promise.resolve(answers.action ?? false);
    },
    confirmChoice: (options) => {
      choices.push(options);
      const wanted = answers.choice === undefined ? options.initial : answers.choice;
      return Promise.resolve(options.choices.find((entry) => entry.value === wanted)?.value ?? null);
    },
  };
  return { ctx, choices, actions };
};

const depsOf = (patch: Partial<EngineStartupDeps> = {}) => {
  const calls: string[] = [];
  const deps: EngineStartupDeps = {
    status: vi.fn(() => Promise.resolve(missing)),
    startup: vi.fn(() => Promise.resolve<StartupDecision>(first)),
    overview: vi.fn((): Promise<EngineOverview> => Promise.resolve(fresh)),
    offerShown: vi.fn((version: string) => {
      calls.push(`offerShown ${version}`);
      return Promise.resolve();
    }),
    install: vi.fn((choice: EngineChoice) => {
      calls.push(`install ${choice.ap} ${choice.python}`);
      return Promise.resolve(installed);
    }),
    switchTo: vi.fn(() => Promise.resolve()),
    finish: vi.fn(() => Promise.resolve()),
    tell: vi.fn(),
    openNotes: vi.fn((url: string) => {
      calls.push(`openNotes ${url}`);
    }),
    ...patch,
  };
  return { deps, calls };
};

const withOffer = (status: EngineStatus = ready): Partial<EngineStartupDeps> => ({
  status: vi.fn(() => Promise.resolve(status)),
  startup: vi.fn(() => Promise.resolve<StartupDecision>(offer)),
});

export { broken, ctxOf, depsOf, first, fresh, installed, latest, missing, offer, ready, withOffer };
