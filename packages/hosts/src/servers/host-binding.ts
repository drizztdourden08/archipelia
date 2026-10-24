/* @layer core @kind logic */
import { ALL_INTERFACES, LOOPBACK } from './host-binding.constants';
import type { HostBinding } from './host-binding.type';

const hostBinding = (automation: boolean, lanHost: () => string): HostBinding =>
  automation ? { bindHost: LOOPBACK, advertiseHost: () => LOOPBACK } : { bindHost: ALL_INTERFACES, advertiseHost: lanHost };

export { hostBinding };
