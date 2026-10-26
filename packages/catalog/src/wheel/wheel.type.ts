/* @layer core @kind types */
import type { PackageSource, SourceWheelFit } from '@archipelia/model';
import type { Fetch } from '../install/fetch-file.type';
import type { GithubClient } from '../source/source.type';

type AssetFact = { name: string; size: number; digest: string | undefined };

type ReleaseFact = { tag: string; prerelease: boolean; assets: AssetFact[] };

type WheelPick = { tag: string; asset: string; size: number; digest: string | undefined; fit: SourceWheelFit };

type WheelSite = { owner: string; repo: string; tag: string; asset: string };

type WheelDownload = { file: string; sha256: string };

type DownloadLimits = { dir: string; size?: number | undefined; expected?: string | undefined };

type LoadedWheel = { source: PackageSource; file: string; requires: string[] };

type WheelLabel = Pick<PackageSource, 'repo' | 'tag' | 'asset' | 'verified'>;

type WheelDeps = { client: GithubClient; fetch: Fetch; engineDir: () => Promise<string> };

export type { AssetFact, DownloadLimits, LoadedWheel, ReleaseFact, WheelDeps, WheelDownload, WheelLabel, WheelPick, WheelSite };
