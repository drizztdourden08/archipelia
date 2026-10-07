/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { PORT_PROBLEM } from '@archipelia/design';
import type { ServerEntry } from '@archipelia/model';
import { draftProblems } from '../../src/views/ServerManager/behavior/draft-problems';
import { shownErrors } from '../../src/views/ServerManager/behavior/shown-errors';
import { newServerEntry } from '../../src/views/ServerManager/behavior/new-server-entry';
import { switchAuth } from '../../src/views/ServerManager/behavior/switch-auth';
import { withSecretRefs } from '../../src/views/ServerManager/behavior/with-secret-refs';
import { serverDirty } from '../../src/views/ServerManager/behavior/server-dirty';
import { saveState } from '../../src/views/ServerManager/behavior/save-state';
import { listRows } from '../../src/views/ServerManager/behavior/list-rows';
import { rowId } from '../../src/views/ServerManager/behavior/row-id';

const NO_INPUTS = { password: '', passphrase: '' };

const messages = (entry: ServerEntry) => draftProblems(entry, NO_INPUTS).map((problem) => problem.message);

const filled = () => ({ ...newServerEntry(), id: 'abc', host: 'vps.example.net', auth: { kind: 'ssh-key' as const, username: 'me', keyPath: '/k' } });

describe('server drafts', () => {
  test('a new entry lists what is missing', () => {
    expect(draftProblems(newServerEntry(), NO_INPUTS)).toEqual([
      { field: 'host', message: 'Enter the host name or address.' },
      { field: 'username', message: 'Enter the user name.' },
      { field: 'keyPath', message: 'Enter the path of the key file.' },
    ]);
  });

  test('a complete key entry has no problems and a relative path is refused', () => {
    expect(messages(filled())).toEqual([]);
    expect(messages({ ...filled(), apPath: 'opt/ap' })).toEqual(['The Archipelago path must be absolute.']);
  });

  test('switching to a password keeps the user and needs a password', () => {
    const entry = switchAuth(filled(), 'ssh-password');
    expect(entry.auth).toEqual({ kind: 'ssh-password', username: 'me', passwordRef: '' });
    expect(messages(entry)).toEqual(['Enter the password.']);
  });

  test('the SSH port takes 22 while the game port follows the hosting range', () => {
    expect(messages({ ...filled(), port: 22, gamePort: 38281 })).toEqual([]);
    expect(messages({ ...filled(), port: 0 })).toEqual(['The SSH port must be between 1 and 65535.']);
    expect(messages({ ...filled(), gamePort: 80 })).toEqual([PORT_PROBLEM]);
    expect(messages({ ...filled(), gamePort: 70000 })).toEqual([PORT_PROBLEM]);
  });

  test('a problem shows once its field was left or Save was pressed', () => {
    const problems = draftProblems(newServerEntry(), NO_INPUTS);
    expect(shownErrors(problems, new Set(), false)).toEqual({});
    expect(shownErrors(problems, new Set(['host', 'label'] as const), false)).toEqual({ host: 'Enter the host name or address.' });
    expect(Object.keys(shownErrors(problems, new Set(), true))).toEqual(['host', 'username', 'keyPath']);
  });

  test('typed secrets become vault references, never values', () => {
    const entry = withSecretRefs(switchAuth(filled(), 'ssh-password'), { password: 'hunter2', passphrase: '' });
    expect(entry.auth).toEqual({ kind: 'ssh-password', username: 'me', passwordRef: 'server-abc-password' });
    expect(JSON.stringify(entry)).not.toContain('hunter2');
  });

  test('only an edit or a typed secret makes a saved server dirty, and a new one is dirty until saved', () => {
    const saved = filled();
    expect(serverDirty(null, undefined, NO_INPUTS)).toBe(false);
    expect(serverDirty(newServerEntry(), undefined, NO_INPUTS)).toBe(true);
    expect(serverDirty({ ...saved, lastTest: { at: 1, ok: true, message: 'ok' }, hostKeySha256: 'sha' }, saved, NO_INPUTS)).toBe(false);
    expect(serverDirty({ ...saved, host: 'other.example.net' }, saved, NO_INPUTS)).toBe(true);
    expect(serverDirty(saved, saved, { password: '', passphrase: 'typed' })).toBe(true);
  });

  test('the save bar shows saving first, then a failure, then edits', () => {
    expect(saveState({ saving: true, failed: true, dirty: true, saved: false })).toBe('saving');
    expect(saveState({ saving: false, failed: true, dirty: true, saved: false })).toBe('error');
    expect(saveState({ saving: false, failed: false, dirty: true, saved: true })).toBe('dirty');
    expect(saveState({ saving: false, failed: false, dirty: false, saved: true })).toBe('saved');
    expect(saveState({ saving: false, failed: false, dirty: false, saved: false })).toBe('clean');
  });

  test('a server not saved yet is the first row of the list, under its own id', () => {
    const fresh = newServerEntry();
    expect(listRows([filled()], fresh).map(rowId)).toEqual(['new-server', 'abc']);
    expect(listRows([filled()], filled()).map(rowId)).toEqual(['abc']);
  });
});
