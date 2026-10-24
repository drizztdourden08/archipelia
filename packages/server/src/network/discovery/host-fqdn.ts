/* @layer core @kind logic */
import { HOST_PREFIX, HOST_SUFFIX, MAX_LABEL } from './network-discovery.constants';

const hostFqdn = (id: string): string => `${`${HOST_PREFIX}${id}`.slice(0, MAX_LABEL)}${HOST_SUFFIX}`;

export { hostFqdn };
