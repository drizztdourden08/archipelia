/* @layer tests @kind test */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { PackageSourceStep } from '@archipelia/design';
import type { SourceBuildPlan, SourceCandidate, SourcePlan, SourceToolEnd, SourceToolPlan } from '@archipelia/model';

const api = {
  sourcesBuildStart: vi.fn(),
  sourcesToolPlan: vi.fn(),
};

vi.mock('../../src/ipc/app-api', () => ({ appApi: () => api }));

const { toolEnded } = await import('../../src/views/GameStore/behavior/tool-ended');

const BUILD: SourceBuildPlan = {
  buildId: '123e4567-e89b-42d3-a456-426614174000', owner: 'Pseudoarc', repo: 'ctrando', module: 'ctrando', commit: 'a'.repeat(40), archiveSha256: 'b'.repeat(64), size: 10, confined: false,
  tools: [{ name: 'setuptools', version: '80.1.0', pin: 'setuptools==80.1.0' }],
};

const WITH_CMAKE: SourceBuildPlan = { ...BUILD, tools: [...BUILD.tools, { name: 'cmake', version: '3.31.6', pin: 'cmake==3.31.6' }] };

const TOOL: SourceToolPlan = {
  tool: 'msvc', os: 'windows', found: 'missing', how: 'winget install', install: { command: 'winget install', size: 'About 4 GB', source: 'winget', elevation: 'system', restart: true },
};

const CANDIDATE: SourceCandidate = {
  id: 'Pseudoarc/ctrando', owner: 'Pseudoarc', repo: 'ctrando', url: 'https://github.com/Pseudoarc/ctrando', stars: 12, archived: false, fork: false, origins: ['world'], contains: true, warnings: [],
};

const PLAN: SourcePlan = {
  owner: 'Pseudoarc', repo: 'ctrando', url: CANDIDATE.url, module: 'ctrando', pin: { kind: 'head', ref: 'main', sha: 'a'.repeat(40) }, python: 'python', command: '', native: true,
  submodules: false, unsure: false, wheelState: 'none',
};

type Build = Extract<PackageSourceStep, { kind: 'build' }>;

const run = () => {
  const steps: Build[] = [];
  const state: Build = { kind: 'build', candidate: CANDIDATE, plan: PLAN, stage: { kind: 'missing', build: BUILD, missing: { tool: 'msvc' }, log: [], tool: TOOL } };
  const setStep = (step: PackageSourceStep) => steps.push(step as Build);
  const install = vi.fn(() => Promise.resolve(undefined));
  const base = {
    aim: { key: 'ctrdi', title: 'Chrono Trigger', module: 'ctrando' }, state, build: BUILD, install, setStep, close: vi.fn(), missing: { tool: 'msvc' as const }, log: ['old line'], tool: TOOL,
  };
  const ended = (end: SourceToolEnd) => toolEnded({ run: base, end });
  return { steps, ended, stages: () => steps.map((step) => step.stage) };
};

beforeEach(() => {
  api.sourcesBuildStart.mockReset().mockResolvedValue({ status: 'cancelled' });
  api.sourcesToolPlan.mockReset().mockResolvedValue(TOOL);
});

describe('after a tool install ends', () => {
  test('checks again by itself and builds with the plan the tool gave back', async () => {
    const { ended, stages } = run();
    await ended({ status: 'done', after: 'check', found: 'found', log: [], plan: WITH_CMAKE });
    expect(api.sourcesBuildStart).toHaveBeenCalledWith({ buildId: BUILD.buildId, archiveSha256: BUILD.archiveSha256, tools: ['setuptools==80.1.0', 'cmake==3.31.6'] });
    expect(stages()[0]).toEqual({ kind: 'building', build: WITH_CMAKE });
  });

  test('checks again with the same plan when the tool did not change it', async () => {
    const { ended } = run();
    await ended({ status: 'done', after: 'check', found: 'found', log: [] });
    expect(api.sourcesBuildStart).toHaveBeenCalledWith(expect.objectContaining({ tools: ['setuptools==80.1.0'] }));
  });

  test('waits for the user after a restart or the Apple window, and does not build', async () => {
    const { ended, stages } = run();
    await ended({ status: 'done', after: 'restart', found: 'missing', log: ['done'] });
    await ended({ status: 'done', after: 'dialog', found: 'missing', log: [] });
    expect(api.sourcesBuildStart).not.toHaveBeenCalled();
    expect(stages()).toEqual([
      { kind: 'paused', build: BUILD, message: expect.stringContaining('restart') as string, log: ['done'] },
      { kind: 'paused', build: BUILD, message: expect.stringContaining('installer window') as string, log: [] },
    ]);
  });

  test('goes back to the two choices when the user cancels', async () => {
    const { ended, stages } = run();
    await ended({ status: 'cancelled' });
    expect(stages()).toEqual([{ kind: 'missing', build: BUILD, missing: { tool: 'msvc' }, log: ['old line'], tool: TOOL }]);
    expect(api.sourcesBuildStart).not.toHaveBeenCalled();
  });

  test('shows the log of an installer that failed, with a way to try again', async () => {
    const { ended, stages } = run();
    await ended({ status: 'failed', message: 'The installer did not finish.', log: ['error 5'] });
    expect(stages()).toEqual([{ kind: 'failed', build: BUILD, message: 'The installer did not finish.', log: ['error 5'] }]);
  });
});
