/* @layer core @kind logic */
import type { PackageSource, SourceWheelRequest } from '@archipelia/model';
import { engineTags, readRuntime, wheelFit, wheelRoot } from '@archipelia/engine';
import { assertConfirmed } from './assert-confirmed';
import { downloadWheel } from './download-wheel';
import { findAsset } from './find-asset';
import { loadWheel } from './load-wheel';
import { NO_BUILD } from './prepare-wheel.constants';
import { storeWheel } from './store-wheel';
import type { WheelDeps } from './wheel.type';

const prepareWheel = async ({ client, fetch: request, engineDir }: WheelDeps, ask: SourceWheelRequest): Promise<PackageSource> => {
  const { owner, repo, tag, module } = ask;
  const runtime = await readRuntime(await engineDir());
  const asset = await findAsset(client, ask);
  if (!wheelFit(asset.name, await engineTags(runtime))) throw new Error(NO_BUILD);
  assertConfirmed(asset, ask);
  const label = { repo: `${owner}/${repo}`, tag, asset: asset.name, verified: asset.digest !== undefined };
  const hit = asset.digest ? await loadWheel(runtime, asset.digest).catch(() => undefined) : undefined;
  if (hit?.source.tag === tag && hit.source.asset === asset.name && hit.source.repo === label.repo) return hit.source;
  const download = await downloadWheel({ owner, repo, tag, asset: asset.name }, request, { dir: wheelRoot(runtime), size: asset.size, expected: asset.digest });
  return (await storeWheel(runtime, download, label, module)).source;
};

export { prepareWheel };
