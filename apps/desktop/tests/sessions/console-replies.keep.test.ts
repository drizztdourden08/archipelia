/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { HostLogLine } from '@archipelia/hosts';
import { consoleRows } from '../../src/views/SessionDashboard/behavior/console-rows';
import { liveDetail } from '../../src/views/SessionDashboard/behavior/live-detail';
import type { SentCommand } from '../../src/views/SessionDashboard/SessionDashboard.type';

const AT = new Date(2026, 0, 1, 12, 0, 0).getTime();

const sent = (id: number, text: string, offset: number, error: string | null = null): SentCommand => ({ id, text, at: AT + offset, error });

const line = (offset: number, text: string): HostLogLine => ({ at: AT + offset, text });

const messages = (rows: { kind: string; message: string }[]) => rows.map((row) => `${row.kind}:${row.message}`);

describe('consoleRows', () => {
  test('shows nothing before the first command', () => {
    expect(consoleRows([], [line(0, 'Hosting game at 0.0.0.0:38281')])).toEqual([]);
  });

  test('puts the reply of the server under each command', () => {
    const lines = [line(-50, 'Hosting game at 0.0.0.0:38281'), line(20, '2 players of 2 connected'), line(1020, 'Saved'), line(1030, 'Error: disk full')];
    const rows = consoleRows([sent(1, '/players', 0), sent(2, '/save', 1000)], lines);
    expect(messages(rows)).toEqual([
      'command:> /players',
      'reply:2 players of 2 connected',
      'command:> /save',
      'reply:Saved',
      'error:Error: disk full',
    ]);
    expect(rows[0]?.gutter).toBe('12:00:00');
    expect(rows[1]?.indent).toBe(1);
  });

  test('leaves later log lines out of the reply', () => {
    const rows = consoleRows([sent(1, '/players', 0)], [line(10, '1 players of 2 connected'), line(60000, 'Bo has joined')], 15000);
    expect(messages(rows)).toEqual(['command:> /players', 'reply:1 players of 2 connected']);
  });

  test('says when a command did not reach the room', () => {
    const rows = consoleRows([sent(1, '/save', 0, 'the room is not hosting')], []);
    expect(messages(rows)).toEqual(['command:> /save', 'error:the room is not hosting']);
    expect(new Set(rows.map((row) => row.id)).size).toBe(rows.length);
  });
});

describe('liveDetail', () => {
  test('explains the idle and password phases and gives the reason otherwise', () => {
    expect(liveDetail('idle', null)).toBe('Live data shows while the room is hosting.');
    expect(liveDetail('password', 'Wrong password')).toBe('Enter it to watch the room.');
    expect(liveDetail('reconnecting', 'The room stopped answering.')).toBe('The room stopped answering.');
    expect(liveDetail('live', 'stale')).toBeNull();
    expect(liveDetail('connecting', null)).toBeNull();
  });
});
