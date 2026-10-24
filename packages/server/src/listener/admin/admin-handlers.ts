/* @layer core @kind logic */
import type { LobbyOptions, SessionEngine } from '@archipelia/model';
import type { AdminHandler } from './admin.type';
import { adminParams } from './admin-params';
import { adminView } from './admin-view';
import { hostSlotsOf } from './host-slots-of';

const lobbyCalls: Record<string, AdminHandler> = {
  'lobby.list': async ({ service }) => (await service.list()).map(adminView),
  'lobby.get': async ({ service }, request) => adminView(await service.get(adminParams(request).text('lobbyId'))),
  'lobby.create': async ({ service }, request) => {
    const params = adminParams(request);
    const engine = params.record('engine') as SessionEngine | undefined;
    const options = params.record('options') as Partial<LobbyOptions> | undefined;
    return adminView(await service.create({ name: params.text('name'), ...(engine ? { engine } : {}), ...(options ? { options } : {}) }));
  },
  'lobby.update': async ({ service }, request) => {
    const params = adminParams(request);
    const name = params.maybeText('name');
    const options = params.record('options') as Partial<LobbyOptions> | undefined;
    return adminView(await service.update(params.text('lobbyId'), { ...(name ? { name } : {}), ...(options ? { options } : {}) }));
  },
  'lobby.lock': async ({ service }, request) => adminView(await service.lock(adminParams(request).text('lobbyId'))),
  'lobby.close': async ({ service }, request) => adminView(await service.close(adminParams(request).text('lobbyId'))),
  'lobby.start': async ({ service }, request) => adminView((await service.start(adminParams(request).text('lobbyId'))).lobby),
  'room.stop': async ({ service }, request) => adminView(await service.stopRoom(adminParams(request).text('lobbyId'))),
};

const memberCalls: Record<string, AdminHandler> = {
  'member.approve': async ({ service }, request) => {
    const params = adminParams(request);
    return adminView(await service.approve(params.text('lobbyId'), params.text('memberId')));
  },
  'member.refuse': async ({ service }, request) => {
    const params = adminParams(request);
    return adminView(await service.refuse(params.text('lobbyId'), params.text('memberId'), params.maybeText('reason')));
  },
  'member.remove': async ({ service }, request) => {
    const params = adminParams(request);
    return adminView(await service.remove(params.text('lobbyId'), params.text('memberId'), params.maybeText('reason')));
  },
  'member.host': async ({ service }, request) => {
    const params = adminParams(request);
    return adminView(await service.addHost(params.text('lobbyId'), { displayName: params.text('displayName'), slots: hostSlotsOf(params.list('slots')) }));
  },
  'world.consent': async ({ service }, request) => {
    const params = adminParams(request);
    return adminView(await service.consent(params.text('lobbyId'), params.text('sha256'), params.flag('allowed')));
  },
};

const serverCalls: Record<string, AdminHandler> = {
  'server.info': (deps) => Promise.resolve(deps.info()),
  'engine.list': (deps) => deps.engines(),
};

const adminHandlers: Record<string, AdminHandler> = { ...serverCalls, ...lobbyCalls, ...memberCalls };

export { adminHandlers };
