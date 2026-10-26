/* @layer core @kind logic */
import type { EngineRuntime, InstalledGame, PackageSource } from '@archipelia/model';
import { engineTags, wheelFit, wheelRoot } from '@archipelia/engine';
import type { Fetch } from '../install/fetch-file.type';
import { downloadWheel } from './download-wheel';
import { installWheels } from './install-wheels';
import { loadWheel } from './load-wheel';
import { storeWheel } from './store-wheel';
import type { LoadedWheel } from './wheel.type';
import { REPO_PATH } from './wheel.constants';

const noFitText = (game: string, { name, version, tag, repo }: PackageSource) =>
  `${game} used ${name} ${version} from GitHub release ${tag} of ${repo}, and that build does not fit this engine. Install the package again from the game card.`;

const fetched = async (runtime: EngineRuntime, source: PackageSource, request: Fetch): Promise<LoadedWheel> => {
  const [, owner, repo] = REPO_PATH.exec(source.repo) ?? [];
  if (owner === undefined || repo === undefined) throw new Error(`${source.repo} is not a GitHub repository.`);
  const download = await downloadWheel({ owner, repo, tag: source.tag, asset: source.asset }, request, { dir: wheelRoot(runtime), expected: source.sha256 });
  return storeWheel(runtime, download, { repo: source.repo, tag: source.tag, asset: source.asset, verified: source.verified, newest: source.newest });
};

const reinstallSources = async (runtime: EngineRuntime, record: InstalledGame, request: Fetch = fetch): Promise<void> => {
  const sources = record.sources ?? [];
  if (sources.length === 0) return;
  const tags = await engineTags(runtime);
  const missing = sources.find((source) => !wheelFit(source.asset, tags));
  if (missing) throw new Error(noFitText(record.game, missing));
  const wheels: LoadedWheel[] = [];
  for (const source of sources) wheels.push(await loadWheel(runtime, source.sha256).catch(() => fetched(runtime, source, request)));
  await installWheels(runtime, record.game, wheels);
};

export { reinstallSources };
