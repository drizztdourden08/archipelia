/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { Session } from '@archipelia/model';
import { findLaunchedRun } from '../../src/runs/find-launched-run';
import { runCodes } from '../../src/views/SessionDashboard/behavior/run-codes';
import { newTemplate } from '../../src/views/SessionBuilder/behavior/new-template';

const run = (id: string, templateId: string, createdAt: number, patch: Partial<Session> = {}): Session => ({
  id, templateId, createdAt, status: 'generating', snapshot: newTemplate(templateId), ...patch,
});

describe('K1 finding the launched run', { tags: ['critical'] }, () => {
  test('picks the first run of the session started after the click', () => {
    const runs = [run('new', 't1', 5000), run('old', 't1', 100), run('other', 't2', 5000)];
    expect(findLaunchedRun(runs, { templateId: 't1', startedAt: 4000 })?.id).toBe('new');
    expect(findLaunchedRun(runs, { templateId: 't3', startedAt: 4000 })).toBeUndefined();
  });
});

describe('K1 the network codes in the run header', { tags: ['critical'] }, () => {
  const shown = (session: Session) => runCodes(session).map((code) => `${code.label}=${code.value}`);

  test('shows only what is known: nothing before the room is up, then host, IP, port, room address and seed', () => {
    expect(shown(run('a', 't1', 1))).toEqual(['Host=local :38281']);
    const up = run('a', 't1', 1, { seed: '123', endpoint: { host: '192.168.1.5', port: 38281 } });
    expect(shown(up)).toEqual(['Host=local :38281', 'IP=192.168.1.5', 'Port=38281', 'Room address=192.168.1.5:38281', 'Seed=123']);
  });
});
