/* @layer tests @kind test */
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, test, vi } from 'vitest';
import type { ProcessJobs } from '@drizztdourden08/brock-electron/main';
import type { ProcessJobOutcome } from '@drizztdourden08/brock-core/types';
import { TOOL_JOB } from '@archipelia/model';
import { createToolRunner } from '../../electron/builds/create-tool-runner';
import { defineToolProcesses } from '../../electron/builds/define-tool-processes';
import type { Stored } from './process.fixtures';
import { fakeProcesses } from './process.fixtures';

const SPEC = { command: 'C:\\winget.exe', args: ['install'], cwd: 'C:\\tools', env: {} };

describe('the processes of a tool install', () => {
  test('K4 never lets the job run an interpreter, so Brock keeps refusing cmd and msiexec', { tags: ['critical'] }, () => {
    const { define, defined } = fakeProcesses();
    defineToolProcesses({ define }, () => Promise.resolve(SPEC));
    for (const stored of defined.values()) expect(stored.allow).toBeUndefined();
  });

  test('K4 takes only the name of a tool from the renderer and lets the app build the command', { tags: ['critical'] }, () => {
    const { define, defined } = fakeProcesses();
    const specOf = vi.fn(() => Promise.resolve(SPEC));
    defineToolProcesses({ define }, specOf);
    const system = defined.get(TOOL_JOB.system) as Stored;
    expect(system.parse({ tool: 'msvc' })).toEqual({ tool: 'msvc' });
    for (const raw of [undefined, 'msvc', { tool: 'cmd.exe' }, { tool: 'msvc && calc' }, { command: 'cmd.exe', args: ['/c', 'calc'] }]) {
      expect(() => system.parse(raw)).toThrow('not valid');
    }
    system.resolve({ tool: 'rust' });
    expect(specOf).toHaveBeenCalledWith({ tool: 'rust' });
  });

  test('K1 reads the lines of the installer from its log file', { tags: ['critical'] }, async () => {
    const logFile = join(mkdtempSync(join(tmpdir(), 'archipelia-tool-')), 'tool.log');
    writeFileSync(logFile, 'Found Microsoft.VisualStudio.2022.BuildTools\r\nInstalling\n');
    const start = vi.fn<ProcessJobs['start']>(() => Promise.resolve<ProcessJobOutcome>({ status: 'done', exitCode: 3010, tail: [], logFile }));
    const run = await createToolRunner({ start })('system', 'msvc');
    expect(start).toHaveBeenCalledWith(TOOL_JOB.system, { tool: 'msvc' });
    expect(run).toEqual({ status: 'done', code: 3010, lines: ['Found Microsoft.VisualStudio.2022.BuildTools', 'Installing'] });
  });

  test('K1 says the installer may still be running when Brock could not stop it', { tags: ['critical'] }, async () => {
    const start = vi.fn<ProcessJobs['start']>(() => Promise.resolve<ProcessJobOutcome>({ status: 'detached', exitCode: null, tail: ['x'], error: 'could not stop' }));
    const run = await createToolRunner({ start })('system', 'msvc');
    expect(run).toMatchObject({ status: 'failed', error: expect.stringContaining('may still be running') as string });
  });

  test('K1 starts the job of the user for a tool that needs no system rights', { tags: ['critical'] }, async () => {
    const start = vi.fn<ProcessJobs['start']>(() => Promise.resolve<ProcessJobOutcome>({ status: 'cancelled', exitCode: null, tail: [] }));
    const run = await createToolRunner({ start })('none', 'rust');
    expect(start).toHaveBeenCalledWith(TOOL_JOB.none, { tool: 'rust' });
    expect(run.status).toBe('cancelled');
  });
});
