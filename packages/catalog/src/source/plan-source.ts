/* @layer core @kind logic */
import type { SourcePlan, SourceRef } from '@archipelia/model';
import { readRuntime } from '@archipelia/engine';
import { commandOf } from './command-of';
import { projectNameOf } from './project-name-of';
import { pypiOffer } from './pypi-offer';
import { readPin } from './read-pin';
import { readRepoFacts } from './read-repo-facts';
import { readSetupFiles } from './read-setup-files';
import type { PlanDeps } from './source.type';
import { treeFactsOf } from './tree-facts-of';
import { wheelOffer } from '../wheel/wheel-offer';

const planSource = async ({ client, fetch: lookup, engineDir }: PlanDeps, ref: SourceRef): Promise<SourcePlan> => {
  const facts = await readRepoFacts(client, ref);
  const repo = { owner: facts.owner, repo: facts.repo };
  const pin = await readPin(client, facts);
  const [tree, files, runtime] = await Promise.all([
    client.api(`/repos/${repo.owner}/${repo.repo}/git/trees/${pin.sha}?recursive=1`),
    readSetupFiles(client, repo, pin.sha),
    engineDir().then(readRuntime),
  ]);
  const projectName = projectNameOf(files);
  const [pypi, offer] = await Promise.all([
    projectName ? pypiOffer(projectName, repo, lookup) : undefined,
    wheelOffer(client, repo, [ref.module, repo.repo, ...(projectName ? [projectName] : [])], runtime),
  ]);
  return {
    ...repo,
    url: `https://github.com/${repo.owner}/${repo.repo}`,
    module: ref.module,
    pin,
    python: runtime.python,
    command: commandOf(runtime.python, repo.owner, repo.repo, pin.sha),
    ...treeFactsOf(tree),
    projectName,
    pypi,
    wheel: offer.wheel,
    wheelState: offer.state,
  };
};

export { planSource };
