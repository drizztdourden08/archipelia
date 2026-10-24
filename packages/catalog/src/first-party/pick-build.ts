/* @layer core @kind logic */
import type { FirstPartyBuild } from '@archipelia/model';

const pickBuild = (builds: FirstPartyBuild[], apVersion: string): FirstPartyBuild | undefined =>
  builds.find((build) => build.archipelagoVersion === apVersion);

export { pickBuild };
