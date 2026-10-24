/* @layer core @kind logic */
import { lobbyOptions } from '../../lobby/state/lobby-options';
import type { AdminHandler } from './admin.type';
import { adminParams } from './admin-params';
import { adminView } from './admin-view';
import { hostSlotsOf } from './host-slots-of';
import { readEngine } from './options/read-engine';
import { readLobbyOptions } from './options/read-lobby-options';
import { readText } from './options/read-text';

const lobbyCalls: Record<string, AdminHandler> = {
  'lobby.list': async ({ service, sandbox }) => (await service.list()).map((lobby) => adminView(sandbox, lobby)),
  'lobby.get': async ({ service, sandbox }, request) => adminView(sandbox, await service.get(adminParams(request).text('lobbyId'))),
  'lobby.create': async ({ service, sandbox }, request) => {
    const params = adminParams(request);
    const engine = readEngine(params.record('engine'));
    const options = readLobbyOptions(params.record('options'), lobbyOptions());
    return adminView(sandbox, await service.create({ name: readText('name', params.text('name')), ...(engine ? { engine } : {}), ...(options ? { options } : {}) }));
  },
  'lobby.update': async ({ service, sandbox }, request) => {
    const params = adminParams(request);
    const name = params.maybeText('name');
    const lobbyId = params.text('lobbyId');
    const current = await service.get(lobbyId);
    if (!current) throw new Error(`no lobby has the id ${lobbyId}`);
    const options = readLobbyOptions(params.record('options'), current.options);
    return adminView(sandbox, await service.update(lobbyId, { ...(name ? { name: readText('name', name) } : {}), ...(options ? { options } : {}) }));
  },
  'lobby.lock': async ({ service, sandbox }, request) => adminView(sandbox, await service.lock(adminParams(request).text('lobbyId'))),
  'lobby.close': async ({ service, sandbox }, request) => adminView(sandbox, await service.close(adminParams(request).text('lobbyId'))),
  'lobby.start': async ({ service, sandbox }, request) => adminView(sandbox, (await service.start(adminParams(request).text('lobbyId'))).lobby),
  'room.stop': async ({ service, sandbox }, request) => adminView(sandbox, await service.stopRoom(adminParams(request).text('lobbyId'))),
};

const memberCalls: Record<string, AdminHandler> = {
  'member.approve': async ({ service, sandbox }, request) => {
    const params = adminParams(request);
    return adminView(sandbox, await service.approve(params.text('lobbyId'), params.text('memberId')));
  },
  'member.refuse': async ({ service, sandbox }, request) => {
    const params = adminParams(request);
    return adminView(sandbox, await service.refuse(params.text('lobbyId'), params.text('memberId'), params.maybeText('reason')));
  },
  'member.remove': async ({ service, sandbox }, request) => {
    const params = adminParams(request);
    return adminView(sandbox, await service.remove(params.text('lobbyId'), params.text('memberId'), params.maybeText('reason')));
  },
  'member.host': async ({ service, sandbox }, request) => {
    const params = adminParams(request);
    return adminView(sandbox, await service.addHost(params.text('lobbyId'), { displayName: params.text('displayName'), slots: hostSlotsOf(params.list('slots')) }));
  },
  'world.consent': async ({ service, sandbox }, request) => {
    const params = adminParams(request);
    return adminView(sandbox, await service.consent(params.text('lobbyId'), params.text('sha256'), params.flag('allowed')));
  },
};

const serverCalls: Record<string, AdminHandler> = {
  'server.info': (deps) => Promise.resolve(deps.info()),
  'engine.list': (deps) => deps.engines(),
};

const adminHandlers: Record<string, AdminHandler> = { ...serverCalls, ...lobbyCalls, ...memberCalls };

export { adminHandlers };
