/* @layer core @kind types */
import type { RunningServer } from '@drizztdourden08/brock-electron/server';
import type { Core } from '../core/core.type';
import type { CoreDomains, CoreNetwork, CorePorts } from '../core/core-ports.type';
import type { ListenerTls, RunningListener } from '../listener/listener.type';
import type { NetworkMode } from '../network';
import type { ReachPorts, ReachStatus } from './reach/reach.type';

type CoreRest = Omit<CorePorts, 'domain' | 'log'>;

type LobbyListen = { port?: number; tls?: ListenerTls; serverVersion?: string; mode?: NetworkMode; reachPorts?: ReachPorts };

type LobbyEndpoint = RunningListener & { reach: () => ReachStatus };

type ListenPorts = { core: Core; network: CoreNetwork; log: (message: string) => void; domain: CoreDomains['domain'] };

type StartedCore = RunningServer & { core: Core; listen: (options?: LobbyListen) => Promise<LobbyEndpoint> };

export type { CoreRest, ListenPorts, LobbyEndpoint, LobbyListen, StartedCore };
