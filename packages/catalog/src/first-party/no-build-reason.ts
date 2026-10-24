/* @layer core @kind logic */
import type { FirstPartyBuild } from '@archipelia/model';

const noBuildReason = (name: string, apVersion: string, builds: FirstPartyBuild[]): string =>
  `No ${name} build for Archipelago ${apVersion}; builds exist for ${builds.map((build) => build.archipelagoVersion).join(', ')}`;

export { noBuildReason };
