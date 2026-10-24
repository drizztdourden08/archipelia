/* @layer core @kind logic */
import type { NetworkMode } from './network-mode.type';

const wantsPortMapping = (mode: NetworkMode): boolean => mode === 'lan-and-internet';

export { wantsPortMapping };
