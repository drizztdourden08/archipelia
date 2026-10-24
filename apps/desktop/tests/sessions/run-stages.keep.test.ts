/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { Session } from '@archipelia/model';
import { findLaunchedRun } from '../../src/runs/find-launched-run';
import { newTemplate } from '../../src/views/SessionBuilder/behavior/new-template';

const run = (id: string, templateId: string, createdAt: number, patch: Partial<Session> = {}): Session => ({
  id, templateId, createdAt, status: 'generating', snapshot: newTemplate(templateId), ...patch,
});

describe('finding the launched run', () => {
  test('picks the first run of the session started after the click', () => {
    const runs = [run('new', 't1', 5000), run('old', 't1', 100), run('other', 't2', 5000)];
    expect(findLaunchedRun(runs, { templateId: 't1', startedAt: 4000 })?.id).toBe('new');
    expect(findLaunchedRun(runs, { templateId: 't3', startedAt: 4000 })).toBeUndefined();
  });
});
