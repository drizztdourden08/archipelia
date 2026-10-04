/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { JobSnapshot } from '@drizztdourden08/brock-core';
import type { Session } from '@archipelia/model';
import { clockOf } from '../../src/views/SessionDashboard/behavior/clock-of';
import { kindOf } from '../../src/views/SessionDashboard/behavior/kind-of';
import { logCopyText, RUN_STATUS } from '@archipelia/design';
import { serverRows } from '../../src/views/SessionDashboard/behavior/server-rows';
import { textFileFor } from '../../src/views/SessionDashboard/behavior/text-file-for';
import { textRows } from '../../src/views/SessionDashboard/behavior/text-rows';
import { pickSession } from '../../src/views/SessionDashboard/behavior/pick-session';
import { addressOf } from '../../src/views/SessionDashboard/behavior/address-of';
import { canStop } from '../../src/views/SessionDashboard/behavior/can-stop';
import { formatDuration } from '../../src/views/SessionDashboard/behavior/format-duration';
import { hostLabel } from '@archipelia/model';
import { progressLabel } from '../../src/views/SessionDashboard/behavior/progress-label';
import { uptimeOf } from '../../src/views/SessionDashboard/behavior/uptime-of';
import { LOG_TABS } from '../../src/views/SessionDashboard/SessionDashboard.constants';
import { spoilerFileOf } from '../../src/views/SessionDashboard/behavior/spoiler-file-of';
import { templateOf } from './session-fixtures';

const JOB: JobSnapshot = {
  id: 'run', title: 'Running', state: 'running', steps: [], currentStep: null, progress: 0, stepProgress: 0,
  line: null, error: null, log: [], startedAt: 0, endedAt: null, cancellable: true,
};

const run = (id: string, createdAt: number, patch: Partial<Session> = {}): Session => ({
  id,
  createdAt,
  status: 'stopped',
  snapshot: templateOf({ name: id }),
  ...patch,
});

describe('session status', () => {
  test('labels and status tones', () => {
    expect(RUN_STATUS.hosting).toEqual({ label: 'Hosting', tone: 'success' });
    expect(RUN_STATUS.failed).toEqual({ label: 'Failed', tone: 'danger' });
    expect(RUN_STATUS.stopped).toEqual({ label: 'Stopped', tone: 'neutral' });
  });

  test('uptime counts from the first server line while hosting', () => {
    expect(formatDuration(0)).toBe('00:00:00');
    expect(formatDuration(((42 * 60) + 10) * 1000)).toBe('00:42:10');
    expect(formatDuration(((25 * 3600) + 61) * 1000)).toBe('25:01:01');
    expect(uptimeOf(run('a', 1000, { status: 'hosting' }), 4000, 64_000)).toBe('00:01:00');
    expect(uptimeOf(run('a', 1000, { status: 'hosting' }), undefined, 61_000)).toBe('00:01:00');
    expect(uptimeOf(run('a', 1000), 4000, 64_000)).toBeNull();
  });

  test('address, host, stage and stop', () => {
    expect(addressOf({ host: '192.168.1.20', port: 38281 })).toBe('192.168.1.20:38281');
    expect(addressOf(undefined)).toBeNull();
    expect(hostLabel({ kind: 'archipelago-gg' })).toBe('archipelago.gg');
    expect(progressLabel({ ...JOB, progress: 0.426 })).toBe('43%');
    expect(progressLabel({ ...JOB, state: 'done', progress: 1 })).toBeNull();
    expect(progressLabel(null)).toBeNull();
    expect(canStop('hosting')).toBe(true);
    expect(canStop('stopped')).toBe(false);
  });
});

describe('pickSession', () => {
  const runs = [run('old', 1, { status: 'hosting' }), run('new', 3, { status: 'hosting' }), run('last', 5)];

  test('a given id wins, even when that run is stopped', () => {
    expect(pickSession(runs, 'last')?.id).toBe('last');
    expect(pickSession(runs, 'gone')).toBeNull();
  });

  test('without an id, the newest hosting run', () => {
    expect(pickSession(runs, '')?.id).toBe('new');
    expect(pickSession([run('x', 1)], '')).toBeNull();
  });
});

describe('log tabs', () => {
  test('the log has a server and a generate tab, never the spoiler', () => {
    expect(LOG_TABS).toEqual(['server', 'generate']);
    expect(textFileFor('generate')).toBe('generate.log');
    expect(textFileFor('server')).toBeNull();
  });

  test('the spoiler file comes from the output, and only when it has one', () => {
    expect(spoilerFileOf(run('a', 1))).toBeNull();
    const withSpoiler = run('a', 1, { output: { zip: 'AP_1.zip', files: [], spoiler: 'AP_1_Spoiler.txt', generateLog: 'generate.log' } });
    expect(spoilerFileOf(withSpoiler)).toBe('output/AP_1_Spoiler.txt');
  });

  test('server lines get a clock and a kind', () => {
    const at = new Date(2026, 8, 27, 12, 1, 4).getTime();
    expect(clockOf(at)).toBe('12:01:04');
    expect(kindOf('(Team #1) Johnny sent Hookshot to Marie (Kokiri Forest)')).toBe('send');
    expect(kindOf('[Hint]: Johnny\'s Moon Pearl is at Dodongo\'s Cavern')).toBe('hint');
    expect(kindOf('Notice (all): Sam has joined the game.')).toBe('join');
    expect(kindOf('Traceback (most recent call last):')).toBe('error');
    expect(kindOf('Hosting game at 0.0.0.0:38281')).toBe('info');
    const [row] = serverRows([{ at, text: '(Team #1) Johnny sent Bow to Johnny (Eastern Palace)' }]);
    expect(row).toMatchObject({ gutter: '12:01:04', tag: 'send', kind: 'send' });
    const shown = serverRows([{ at, text: 'Hosting game at 0.0.0.0:38281' }, { at, text: 'Notice (all): Sam has joined the game.' }]);
    expect(logCopyText(shown)).toBe('12:01:04 Hosting game at 0.0.0.0:38281\n12:01:04 [join] Notice (all): Sam has joined the game.');
    expect(logCopyText(shown.filter((line) => line.kind === 'join'))).toBe('12:01:04 [join] Notice (all): Sam has joined the game.');
  });

  test('text files split into numbered rows without a trailing blank', () => {
    const rows = textRows('first\r\nsecond\n');
    expect(rows.map((row) => [row.gutter, row.message])).toEqual([['1', 'first'], ['2', 'second']]);
    expect(textRows(null)).toEqual([]);
    expect(logCopyText(rows)).toBe('first\nsecond');
  });
});
