/* @layer client-kit @kind logic */
import type { ReleaseInput, ReleaseManifest, ReleaseWorld } from './release.type';
import { createIssuesError } from '../errors/create-issues-error';
import { recordOf } from '../index-manifest/record-of';
import { compareApVersions } from '../versions/compare-ap-versions';
import { checkReleaseManifest } from './check-release-manifest';
import { KIT_VERSION, RELEASE_FORMAT } from './release.constants';

const worldOf = ({ file, sha256, size, bundle }: ReleaseWorld): ReleaseWorld => ({
  file,
  sha256,
  size,
  ...(bundle === undefined ? {} : { bundle }),
});

const sourceOf = (input: ReleaseInput): Pick<ReleaseManifest, 'builds' | 'world'> => {
  if (input.world !== undefined) return { world: worldOf(input.world) };
  const ordered = [...(input.builds ?? [])].sort((a, b) => compareApVersions(a.archipelagoVersion, b.archipelagoVersion));
  return { builds: ordered.map((build) => recordOf(input.module, build)) };
};

const buildReleaseManifest = (input: ReleaseInput): ReleaseManifest => {
  const issues = checkReleaseManifest(input);
  if (issues.length > 0) throw createIssuesError('invalid-release', 'The release manifest input is not valid:', issues);
  const { game, module, worldVersion, minimumAp, maximumAp, direct, kit, appVersion } = input;
  return {
    format: RELEASE_FORMAT,
    game,
    module,
    worldVersion,
    minimumAp,
    ...(maximumAp === undefined ? {} : { maximumAp }),
    direct,
    kit: kit ?? KIT_VERSION,
    ...(appVersion === undefined ? {} : { appVersion }),
    ...sourceOf(input),
  };
};

export { buildReleaseManifest };
