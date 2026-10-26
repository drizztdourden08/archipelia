/* @layer core @kind logic */
import { normalizePackageName, parseWheelName, wheelFit } from '@archipelia/engine';
import type { AssetFact, ReleaseFact, WheelPick } from './wheel.type';
import { releasePool } from './release-pool';

const fitOf = (asset: AssetFact, tags: readonly string[], names: ReadonlySet<string>) => {
  const name = parseWheelName(asset.name);
  if (!name || !names.has(normalizePackageName(name.distribution))) return undefined;
  const fit = wheelFit(asset.name, tags);
  return fit && { asset, ...fit };
};

const bestIn = (release: ReleaseFact, tags: readonly string[], names: ReadonlySet<string>): WheelPick | undefined => {
  const fits = release.assets.flatMap((asset) => fitOf(asset, tags, names) ?? []).sort((left, right) => left.rank - right.rank);
  const [best] = fits;
  return best && { tag: release.tag, asset: best.asset.name, size: best.asset.size, digest: best.asset.digest, fit: best.kind };
};

const pickWheel = (releases: readonly ReleaseFact[], tags: readonly string[], names: readonly string[]): WheelPick | undefined => {
  const wanted = new Set(names.map(normalizePackageName));
  const pool = releasePool(releases);
  for (const release of pool) {
    const pick = bestIn(release, tags, wanted);
    if (pick) return release === pool[0] ? pick : { ...pick, newest: pool[0]?.tag };
  }
  return undefined;
};

export { pickWheel };
