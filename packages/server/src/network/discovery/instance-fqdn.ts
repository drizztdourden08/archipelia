/* @layer core @kind logic */
import { MAX_LABEL, SERVICE_DOMAIN } from './network-discovery.constants';

const instanceFqdn = (id: string): string => `${id.slice(0, MAX_LABEL)}.${SERVICE_DOMAIN}`;

export { instanceFqdn };
