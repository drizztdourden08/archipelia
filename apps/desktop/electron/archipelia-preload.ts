/* @layer electron-preload @kind logic */
import type { BridgeTools, PreloadNamespace } from '@drizztdourden08/brock-electron/preload';
import type { EventContract, InvokeContract } from '@drizztdourden08/brock-core/augment';
import { ARCHIPELIA_EVENT_MAP, ARCHIPELIA_INVOKE_MAP } from '../src/ipc/contract.constants';
import type { ArchipeliaApi } from '../src/ipc/contract.type';

const methodFor = <K extends keyof InvokeContract>(invoke: BridgeTools['invoke'], channel: K) =>
  (...args: Parameters<InvokeContract[K]>) => invoke(channel, ...args);

const listenerFor = <K extends keyof EventContract>(subscribe: BridgeTools['subscribe'], channel: K) =>
  (callback: EventContract[K]) => subscribe(channel, callback);

const buildArchipeliaApi = ({ invoke, subscribe }: BridgeTools): ArchipeliaApi => {
  const methods = Object.entries(ARCHIPELIA_INVOKE_MAP).map(([name, channel]) => [name, methodFor(invoke, channel)]);
  const events = Object.entries(ARCHIPELIA_EVENT_MAP).map(([name, channel]) => [name, listenerFor(subscribe, channel)]);
  return Object.fromEntries([...methods, ...events]) as ArchipeliaApi;
};

const archipeliaPreload: PreloadNamespace = { id: 'archipelia', build: buildArchipeliaApi };

export { archipeliaPreload };
