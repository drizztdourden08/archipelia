/* @layer renderer-app @kind logic */
import { confirmAction, confirmChoice } from '@drizztdourden08/brock-react';
import type { EngineOverview, StartupDecision } from '@archipelia/model';
import type { EngineStartupDeps, StartupCtx } from '../hooks/engine-startup/engine-startup.type';
import { runEngineStartup } from '../hooks/engine-startup/run-engine-startup';
import { DEFAULT_SETTINGS } from '../settings.constants';
import { REHEARSED, REHEARSED_CHOICE } from './startup-rehearsal.constants';
import type { Rehearsal } from './startup-rehearsal.type';

const ctx: StartupCtx = {
  settings: { get: () => DEFAULT_SETTINGS },
  confirmAction,
  confirmChoice,
};

const fixedRange = { min: '3.11.9', maxExclusive: '3.14.0', source: 'declared' } as const;

const withoutEngine = (real: EngineOverview): EngineOverview => ({
  ...real,
  active: undefined,
  installed: [],
  status: { state: 'missing', dir: real.status.dir },
  feed: {
    ...real.feed,
    state: 'fresh',
    releases: [REHEARSED.latest, REHEARSED.current].map((version) => ({ version, tag: version, publishedAt: '2026-10-04T00:00:00Z', notesUrl: `https://example.test/${version}` })),
    python: [{ version: REHEARSED_CHOICE.python, release: REHEARSED_CHOICE.pythonRelease, target: 'review', file: 'cpython.tar.gz', sha256: '' }],
  },
  ranges: { [REHEARSED.latest]: fixedRange, [REHEARSED.current]: fixedRange },
});

const rehearse = (decision: StartupDecision, status: 'missing' | 'ready', real: EngineOverview): Rehearsal => {
  const installs: string[] = [];
  const offered: string[] = [];
  const opened: string[] = [];
  const deps: EngineStartupDeps = {
    status: () => Promise.resolve({ state: status, dir: real.status.dir }),
    startup: () => Promise.resolve(decision),
    overview: () => Promise.resolve(withoutEngine(real)),
    offerShown: (version) => {
      offered.push(version);
      return Promise.resolve();
    },
    install: (picked) => {
      installs.push(picked.ap);
      return Promise.resolve({ outcome: 'cancelled' });
    },
    switchTo: () => Promise.resolve(),
    finish: () => Promise.resolve(),
    tell: () => undefined,
    openNotes: (url) => {
      opened.push(url);
    },
  };
  return { ran: runEngineStartup(ctx, deps), installs, offered, opened };
};

export { rehearse };
