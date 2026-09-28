/* @layer renderer-app @kind logic */
import type { HostTarget } from '@archipelia/model';
import type { HostingDefaults } from '../SessionBuilder.type';
import { ggTarget } from './gg-target';

const defaultHostOf = ({ defaultHost, localPort, ggBaseUrl }: HostingDefaults): HostTarget =>
  (defaultHost === 'archipelago-gg' ? ggTarget(ggBaseUrl) : { kind: 'local', port: localPort });

export { defaultHostOf };
