/* @layer core @kind logic */
import { BUNDLE_SUFFIX } from './first-party.constants';
import type { BuildRecord, ReleaseState, StandardBuild, StandardFile, StandardManifest } from './first-party.type';
import { isStandardManifest } from './is-standard-manifest';
import type { Expected } from './standard-state.type';

const bundleOf = ({ file, bundle }: StandardFile): string => bundle ?? `${file}${BUNDLE_SUFFIX}`;

const buildOf = (build: StandardBuild): BuildRecord => ({
  archipelagoVersion: build.archipelagoVersion,
  file: build.file,
  sha256: build.sha256,
  size: build.size,
  bundle: bundleOf(build),
});

const rangeOf = ({ minimumAp, maximumAp }: StandardManifest) => ({ minimumAp, ...(maximumAp ? { maximumAp } : {}) });

const standardState = (manifest: unknown, expected?: Expected): ReleaseState => {
  if (!isStandardManifest(manifest)) throw new Error('not a release manifest');
  if (expected && (manifest.module !== expected.module || manifest.game !== expected.game)) {
    throw new Error(`it lists ${manifest.game} (${manifest.module}), the registry lists ${expected.game} (${expected.module})`);
  }
  const { builds, world } = manifest;
  const base = { game: manifest.game, worldVersion: manifest.worldVersion, ...(manifest.appVersion ? { appVersion: manifest.appVersion } : {}) };
  if (builds) return { kind: 'builds', manifest: { ...base, module: manifest.module, ...rangeOf(manifest), builds: builds.map(buildOf) } };
  if (!world) throw new Error('it names no apworld');
  return {
    kind: 'found',
    manifest: { ...base, module: manifest.module, ...rangeOf(manifest), sha256: world.sha256, size: world.size },
    names: { world: world.file, bundle: bundleOf(world) },
  };
};

export { standardState };
