/* @layer renderer-app @kind logic */
import type { HostTarget } from '@archipelia/model';
import { HOST_LABEL } from '../SessionDashboard.constants';

const hostLabel = (host: HostTarget) => HOST_LABEL[host.kind];

export { hostLabel };
