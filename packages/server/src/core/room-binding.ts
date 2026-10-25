/* @layer core @kind logic */
import { hostBinding } from '@archipelia/hosts';
import type { HostBinding } from '@archipelia/hosts';
import type { NetworkMode } from '../network';
import type { CoreNetwork } from './core-ports.type';

const roomBinding = (mode: NetworkMode, network: CoreNetwork): HostBinding => hostBinding(network.automation || mode === 'off', network.lanHost);

export { roomBinding };
