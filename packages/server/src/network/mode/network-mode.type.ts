/* @layer core @kind types */
import type { NETWORK_MODES } from './network-mode.constants';

type NetworkMode = (typeof NETWORK_MODES)[number];

export type { NetworkMode };
