/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { JobSnapshot } from '@drizztdourden08/brock-core';
import { setupProgress } from '../../src/views/EngineSettings/behavior/setup-progress';
import { STATE_VIEW } from '../../src/views/EngineSettings/EngineSettings.constants';

const job = (patch: Partial<JobSnapshot>): JobSnapshot => ({
  id: 'archipelia-engine-setup', title: 'Engine', state: 'running', currentStep: 'python', progress: 0.42, stepProgress: 0.5, line: null, error: null,
  log: [], startedAt: 0, endedAt: null, cancellable: false,
  steps: [
    { id: 'python', label: 'Download Python', weight: 1, state: 'current' },
    { id: 'source', label: 'Fetch Archipelago', weight: 1, state: 'upcoming' },
  ],
  ...patch,
});

describe('engine setup progress', () => {
  test('a running setup shows its percent and current step', () => {
    expect(setupProgress(job({}))).toEqual({ percent: 42, step: 'Download Python' });
  });

  test('a setup with no current step yet is starting', () => {
    expect(setupProgress(job({ currentStep: null, progress: 0 }))).toEqual({ percent: 0, step: 'Starting' });
  });

  test('no bar when no setup runs', () => {
    expect(setupProgress(null)).toBeNull();
    expect(setupProgress(job({ state: 'done' }))).toBeNull();
    expect(setupProgress(job({ state: 'failed' }))).toBeNull();
  });

  test('a failed engine reads Setup failed', () => {
    expect(STATE_VIEW.failed.label).toBe('Setup failed');
  });
});
