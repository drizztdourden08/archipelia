/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { ServerEntry } from '@archipelia/model';
import { lobbyRequest } from '../../src/lobbies/lobby-request';
import { createRows } from '../../src/views/LobbyCreate/behavior/create-rows';
import { draftProblems } from '../../src/views/LobbyCreate/behavior/draft-problems';
import { newDraft } from '../../src/views/LobbyCreate/behavior/new-draft';
import { roomOfKind } from '../../src/views/LobbyCreate/behavior/room-of-kind';
import type { RowsInput } from '../../src/views/LobbyCreate/LobbyCreate.type';
import { inputOf, optionsOf, problemOf } from './row-parts';

const defaults = { port: 38281, ggBaseUrl: 'https://archipelago.gg' };

const machine = { id: 'ssh1', label: 'Home box' } as ServerEntry;

const rowsInput = (patch: Partial<RowsInput> = {}): RowsInput => ({
  draft: newDraft(defaults), view: { info: { name: 'Archipelia', version: '1', port: 1, sandbox: 'none', tls: false }, engine: { id: 'e', ap: '0.6.7', python: '3.12.0' } },
  machines: [machine], defaults, local: true, problems: [], onDraft: () => undefined, ...patch,
});

describe('the new lobby form', () => {
  test('starts with host approval on, unlisted clients off and the room on the server computer', () => {
    expect(newDraft(defaults)).toEqual({ name: '', admission: 'host-approval', allowUnlisted: false, maxSlots: 16, room: { kind: 'local', port: 38281 } });
  });

  test('names every problem of an empty or wrong draft', () => {
    const fields = (draft: ReturnType<typeof newDraft>) => draftProblems(draft).map((problem) => problem.field);
    expect(fields(newDraft(defaults))).toEqual(['name']);
    expect(fields({ ...newDraft(defaults), name: 'A', room: { kind: 'local', port: 80 }, maxSlots: 0 })).toEqual(['port', 'slots']);
    expect(fields({ ...newDraft(defaults), name: 'A', room: { kind: 'remote', serverId: '' } })).toEqual(['machine']);
    expect(fields({ ...newDraft(defaults), name: 'A' })).toEqual([]);
  });

  test('switches the room host type and keeps the same type as it was', () => {
    const local = { kind: 'local', port: 40000 } as const;
    expect(roomOfKind('local', local, [machine], defaults)).toBe(local);
    expect(roomOfKind('remote', local, [machine], defaults)).toEqual({ kind: 'remote', serverId: 'ssh1' });
    expect(roomOfKind('archipelago-gg', local, [], defaults)).toEqual({ kind: 'archipelago-gg' });
    expect(roomOfKind('archipelago-gg', local, [], { ...defaults, ggBaseUrl: 'https://ap.example.net' })).toEqual({ kind: 'archipelago-gg', baseUrl: 'https://ap.example.net' });
    expect(roomOfKind('local', { kind: 'archipelago-gg' }, [], defaults)).toEqual({ kind: 'local', port: 38281 });
  });

  test('shows the options under their names and the engine version read only', () => {
    const rows = createRows(rowsInput());
    expect(rows.map((row) => row.title)).toEqual(['Name', 'Host approval', 'Allow unlisted clients', 'Room host', 'Room port', 'Archipelago version', 'Maximum slots']);
    const version = rows.find((row) => row.id === 'version');
    expect(version).toMatchObject({ disabled: true });
    expect(inputOf(version)).toMatchObject({ kind: 'text', value: '0.6.7' });
    expect(optionsOf(rows.find((row) => row.id === 'room')).map((option) => option.value)).toEqual(['local', 'remote', 'archipelago-gg']);
  });

  test('offers the remote machine only to the server on this computer, and not without a saved machine', () => {
    const optionValues = (input: RowsInput) => optionsOf(createRows(input).find((row) => row.id === 'room'));
    expect(optionValues(rowsInput({ local: false })).map((option) => option.value)).toEqual(['local', 'archipelago-gg']);
    expect(optionValues(rowsInput({ machines: [] })).find((option) => option.value === 'remote')?.disabled).toContain('Servers');
  });

  test('reports a missing engine on the version row', () => {
    const rows = createRows(rowsInput({ view: { info: { name: 'Archipelia', version: '1', port: 1, sandbox: 'none', tls: false } } }));
    expect(problemOf(rows.find((row) => row.id === 'version'))).toContain('no Archipelago engine');
  });

  test('builds the admin request with the options the host chose', () => {
    expect(lobbyRequest.create({ ...newDraft(defaults), name: 'Friday', allowUnlisted: true })).toEqual({
      type: 'lobby.create',
      params: { name: 'Friday', options: { admission: 'host-approval', allowUnlisted: true, maxSlots: 16, room: { kind: 'local', port: 38281 } } },
    });
    expect(lobbyRequest.consent('lb', 'abc', false)).toEqual({ type: 'world.consent', params: { lobbyId: 'lb', sha256: 'abc', allowed: false } });
  });
});
