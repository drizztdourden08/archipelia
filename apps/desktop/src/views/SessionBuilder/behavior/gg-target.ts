/* @layer renderer-app @kind logic */
import type { HostTarget } from '@archipelia/model';
import { DEFAULT_GG_SITE } from '../SessionBuilder.constants';

const ggTarget = (baseUrl: string): HostTarget =>
  (baseUrl && baseUrl !== DEFAULT_GG_SITE ? { kind: 'archipelago-gg', baseUrl } : { kind: 'archipelago-gg' });

export { ggTarget };
