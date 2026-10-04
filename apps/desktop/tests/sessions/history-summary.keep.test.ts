/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { Session } from '@archipelia/model';
import { newTemplate } from '../../src/views/SessionBuilder/behavior/new-template';
import { hostOfKind } from '../../src/views/SessionBuilder/behavior/host-of-kind';
import { withPort } from '../../src/views/SessionBuilder/behavior/with-port';
import { runSummary } from '../../src/views/SessionsLibrary/behavior/run-summary';
import { hostLabel } from '@archipelia/model';
import { matchesTemplate } from '../../src/views/SessionsLibrary/behavior/matches-template';
import { templateMeta } from '../../src/views/SessionsLibrary/behavior/template-meta';
import { presetPlayer } from './session-fixtures';

const TEMPLATE = { ...newTemplate('t1'), name: 'Friday night', players: [presetPlayer(1, 'Johnny'), presetPlayer(2, 'Marie')] };

describe('session summary', () => {
  test('meta lists players, host and spoiler', () => {
    expect(templateMeta(TEMPLATE)).toBe('Johnny · Marie · local :38281 · spoiler full');
    expect(hostLabel({ kind: 'archipelago-gg' })).toBe('archipelago.gg');
    expect(matchesTemplate(TEMPLATE, 'marie')).toBe(true);
    expect(matchesTemplate(TEMPLATE, 'sam')).toBe(false);
  });
});

describe('run summary', () => {
  const session = (patch: Partial<Session>): Session => ({ id: 's1', status: 'hosting', createdAt: 0, snapshot: TEMPLATE, ...patch });

  test('status tones follow the run state', () => {
    expect(runSummary(session({})).status).toEqual({ label: 'Hosting', tone: 'success' });
    expect(runSummary(session({})).canDelete).toBe(false);
    expect(runSummary(session({ status: 'stopped' })).canDelete).toBe(true);
    expect(runSummary(session({ status: 'stopped' })).status.tone).toBe('neutral');
    const failed = runSummary(session({ status: 'failed', error: 'boom' }));
    expect(failed).toMatchObject({ status: { label: 'Generation failed', tone: 'danger' }, error: 'boom', hasLog: true });
  });
});

describe('host target', () => {
  test('switching kind keeps the current target or builds a default one', () => {
    const local = { kind: 'local' as const, port: 1234 };
    expect(hostOfKind('local', local, [])).toBe(local);
    expect(hostOfKind('remote', local, [])).toEqual({ kind: 'remote', serverId: '' });
    expect(withPort(local, 40000.4)).toEqual({ kind: 'local', port: 40000 });
  });
});
