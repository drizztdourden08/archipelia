/* @layer core @kind logic */
import type { NetworkMode } from './network-mode.type';
import { NETWORK_MODES } from './network-mode.constants';

const isNetworkMode = (value: unknown): value is NetworkMode => NETWORK_MODES.some((mode) => mode === value);

export { isNetworkMode };
