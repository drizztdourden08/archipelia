/* @layer core @kind types */
import type { RunningServer } from '@drizztdourden08/brock-electron/server';
import type { Core } from '../core/core.type';
import type { CorePorts } from '../core/core-ports.type';
import type { ListenerTls, RunningListener } from '../listener/listener.type';

type CoreRest = Omit<CorePorts, 'domain' | 'log'>;

type LobbyListen = { port?: number; tls?: ListenerTls; serverVersion?: string };

type StartedCore = RunningServer & { core: Core; listen: (options?: LobbyListen) => Promise<RunningListener> };

export type { CoreRest, LobbyListen, StartedCore };
