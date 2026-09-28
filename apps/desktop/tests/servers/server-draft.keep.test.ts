/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { draftProblems } from '../../src/views/ServerManager/behavior/draft-problems';
import { newServerEntry } from '../../src/views/ServerManager/behavior/new-server-entry';
import { switchAuth } from '../../src/views/ServerManager/behavior/switch-auth';
import { withSecretRefs } from '../../src/views/ServerManager/behavior/with-secret-refs';

const filled = () => ({ ...newServerEntry(), id: 'abc', host: 'vps.example.net', auth: { kind: 'ssh-key' as const, username: 'me', keyPath: '/k' } });

describe('server drafts', () => {
  test('a new entry lists what is missing', () => {
    expect(draftProblems(newServerEntry(), { password: '', passphrase: '' })).toEqual([
      'Enter the host name or address.', 'Enter the user name.', 'Enter the path of the key file.',
    ]);
  });

  test('a complete key entry has no problems and a relative path is refused', () => {
    expect(draftProblems(filled(), { password: '', passphrase: '' })).toEqual([]);
    expect(draftProblems({ ...filled(), apPath: 'opt/ap' }, { password: '', passphrase: '' })).toEqual(['The Archipelago path must be absolute.']);
  });

  test('switching to a password keeps the user and needs a password', () => {
    const entry = switchAuth(filled(), 'ssh-password');
    expect(entry.auth).toEqual({ kind: 'ssh-password', username: 'me', passwordRef: '' });
    expect(draftProblems(entry, { password: '', passphrase: '' })).toEqual(['Enter the password.']);
  });

  test('typed secrets become vault references, never values', () => {
    const entry = withSecretRefs(switchAuth(filled(), 'ssh-password'), { password: 'hunter2', passphrase: '' });
    expect(entry.auth).toEqual({ kind: 'ssh-password', username: 'me', passwordRef: 'server-abc-password' });
    expect(JSON.stringify(entry)).not.toContain('hunter2');
  });
});
