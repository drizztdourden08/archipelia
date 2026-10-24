/* @layer core @kind logic */
import type { NetworkMode } from './network-mode.type';

const wantsDiscovery = (mode: NetworkMode): boolean => mode === 'lan' || mode === 'lan-and-internet';

export { wantsDiscovery };
