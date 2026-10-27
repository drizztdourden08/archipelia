/* @layer tests @kind test */
import { describe, expect, test, vi } from 'vitest';
import type { ProcessJobs } from '@drizztdourden08/brock-electron/main';
import type { ProcessJobOutcome } from '@drizztdourden08/brock-core/types';
import { TOOL_JOB } from '@archipelia/model';
import { createBuildLines } from '../../electron/builds/create-build-lines';
import { createToolRunner } from '../../electron/builds/create-tool-runner';
import { defineToolProcesses } from '../../electron/builds/define-tool-processes';
import type { Stored } from './process.fixtures';
import { fakeProcesses } from './process.fixtures';

const SPEC = { command: 'C:\\winget.exe', args: ['install'], cwd: 'C:\\tools', env: {} };

describe('the processes of a tool install', () => {
  test('declares one job that may be elevated and one that is not, with a label and a time limit each', () => {
    const { define, defined } = fakeProcesses();
    defineToolProcesses({ define }, () => Promise.resolve(SPEC), createBuildLines());
    expect([...defined.keys()]).toEqual([TOOL_JOB.none, TOOL_JOB.system]);
    expect(defined.get(TOOL_JOB.none)?.elevate).toBeUndefined();
    expect(defined.get(TOOL_JOB.system)?.elevate).toBe('installer');
    for (const stored of defined.values()) {
      expect(stored.label).toMatch(/\w/);
      expect(stored.timeoutMs).toBeGreaterThan(0);
      expect(stored.successCodes).toEqual([0, 3010]);
      expect(stored.allow).toBeUndefined();
    }
  });

  test('never lets the job run an interpreter, so Brock keeps refusing cmd and msiexec', () => {
    const { define, defined } = fakeProcesses();
    defineToolProcesses({ define }, () => Promise.resolve(SPEC), createBuildLines());
    for (const stored of defined.values()) expect(stored.allow).toBeUndefined();
  });

  test('takes only the name of a tool from the renderer and lets the app build the command', () => {
    const { define, defined } = fakeProcesses();
    const specOf = vi.fn(() => Promise.resolve(SPEC));
    defineToolProcesses({ define }, specOf, createBuildLines());
    const system = defined.get(TOOL_JOB.system) as Stored;
    expect(system.parse({ tool: 'msvc' })).toEqual({ tool: 'msvc' });
    for (const raw of [undefined, 'msvc', { tool: 'cmd.exe' }, { tool: 'msvc && calc' }, { command: 'cmd.exe', args: ['/c', 'calc'] }]) {
      expect(() => system.parse(raw)).toThrow('not valid');
    }
    system.resolve({ tool: 'rust' });
    expect(specOf).toHaveBeenCalledWith({ tool: 'rust' });
  });

  test('keeps the lines of the installer for the diagnosis', async () => {
    const { define, defined } = fakeProcesses();
    const lines = createBuildLines();
    defineToolProcesses({ define }, () => Promise.resolve(SPEC), lines);
    const start = vi.fn<ProcessJobs['start']>(() => {
      const system = defined.get(TOOL_JOB.system) as Stored;
      system.progress('Found Microsoft.VisualStudio.2022.BuildTools');
      system.progress('Installing');
      return Promise.resolve<ProcessJobOutcome>({ status: 'done', exitCode: 3010, tail: [] });
    });
    const run = await createToolRunner({ start }, lines)('system', 'msvc');
    expect(start).toHaveBeenCalledWith(TOOL_JOB.system, { tool: 'msvc' });
    expect(run).toEqual({ status: 'done', code: 3010, lines: ['Found Microsoft.VisualStudio.2022.BuildTools', 'Installing'] });
  });

  test('starts the job of the user for a tool that needs no system rights', async () => {
    const start = vi.fn<ProcessJobs['start']>(() => Promise.resolve<ProcessJobOutcome>({ status: 'cancelled', exitCode: null, tail: [] }));
    const run = await createToolRunner({ start }, createBuildLines())('none', 'rust');
    expect(start).toHaveBeenCalledWith(TOOL_JOB.none, { tool: 'rust' });
    expect(run.status).toBe('cancelled');
  });
});
