/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { Session } from '@archipelia/model';
import { findLaunchedRun } from '../../src/views/RunProgress/behavior/find-launched-run';
import { tailLines } from '../../src/views/RunProgress/behavior/tail-lines';
import { lineOf } from '../../src/views/RunProgress/behavior/line-of';
import { percentOf } from '../../src/views/RunProgress/behavior/percent-of';
import { stepsOf } from '../../src/views/RunProgress/behavior/steps-of';
import { newTemplate } from '../../src/views/SessionBuilder/behavior/new-template';

const statesOf = (steps: ReturnType<typeof stepsOf>) => steps.map((step) => step.state);

describe('stage to percent', () => {
  test('stages climb in order and fill uses its counts', () => {
    expect(percentOf('generating', undefined)).toBe(0);
    expect(percentOf('generating', { stage: 'rolling' })).toBe(0);
    expect(percentOf('generating', { stage: 'rules' })).toBe(15);
    expect(percentOf('generating', { stage: 'fill', done: 0, total: 100 })).toBe(25);
    expect(percentOf('generating', { stage: 'fill', done: 50, total: 100 })).toBe(48);
    expect(percentOf('generating', { stage: 'output', done: 1, total: 2 })).toBe(86);
    expect(percentOf('starting', { stage: 'done' })).toBe(98);
    expect(percentOf('hosting', undefined)).toBe(100);
  });

  test('the line names the stage and its counts', () => {
    expect(lineOf('generating', { stage: 'fill', done: 5500, total: 12000 })).toBe('Filling the multiworld · 5500 / 12000 items');
    expect(lineOf('generating', { stage: 'output', done: 1, total: 3 })).toBe('Writing the output files · 1 / 3');
    expect(lineOf('starting', undefined)).toBe('Starting the server');
  });
});

describe('step list', () => {
  test('steps before the current stage are done, the rest pending', () => {
    const steps = stepsOf('generating', { stage: 'fill' }, 3, { kind: 'local', port: 38281 });
    expect(steps[0]?.label).toBe('Rolling 3 player files');
    expect(statesOf(steps)).toEqual(['done', 'done', 'done', 'current', 'pending', 'pending']);
    expect(steps[5]?.label).toBe('Starting the local server');
  });

  test('starting the server marks every engine step done', () => {
    expect(statesOf(stepsOf('starting', { stage: 'done' }, 1))).toEqual(['done', 'done', 'done', 'done', 'done', 'current']);
    expect(statesOf(stepsOf('hosting', undefined, 1)).every((state) => state === 'done')).toBe(true);
  });
});

describe('finding the launched run', () => {
  const run = (id: string, templateId: string, createdAt: number): Session => ({
    id, templateId, createdAt, status: 'generating', snapshot: newTemplate(templateId),
  });

  test('picks the first run of the session started after the click', () => {
    const runs = [run('new', 't1', 5000), run('old', 't1', 100), run('other', 't2', 5000)];
    expect(findLaunchedRun(runs, { name: 'x', templateId: 't1', startedAt: 4000 })?.id).toBe('new');
    expect(findLaunchedRun(runs, { name: 'x', templateId: 't3', startedAt: 4000 })).toBeUndefined();
    expect(findLaunchedRun(runs, { name: 'x', sessionId: 'old', startedAt: 0 })?.id).toBe('old');
  });

  test('the log tail keeps the last non empty lines', () => {
    expect(tailLines('a\n\nb\r\nc\n', 2)).toEqual(['b', 'c']);
    expect(tailLines(null)).toEqual([]);
  });
});
