/* @layer core @kind types */
import type { RunningServer } from '@drizztdourden08/brock-electron/server';
import type { Core } from '../core/core.type';
import type { CorePorts } from '../core/core-ports.type';

type CoreRest = Omit<CorePorts, 'domain' | 'log'>;

type StartedCore = RunningServer & { core: Core };

export type { CoreRest, StartedCore };
