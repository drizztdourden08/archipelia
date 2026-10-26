/* @layer core @kind logic */
import { normalizePackageName } from '@archipelia/engine';
import type { GithubRepo } from '../enrich/enrich.type';
import { projectNameOf } from './project-name-of';
import { readSetupFiles } from './read-setup-files';
import type { GithubClient } from './source.type';

const moduleFiles = (module: string) => [`src/${module}/__init__.py`, `${module}/__init__.py`, `${module}.py`, `src/${module}.py`];

const moduleInRepo = async (client: GithubClient, repo: GithubRepo, module: string): Promise<boolean> => {
  const name = projectNameOf(await readSetupFiles(client, repo, 'HEAD'));
  if (name && normalizePackageName(name) === normalizePackageName(module)) return true;
  const hits = await Promise.all(moduleFiles(module).map((file) => client.raw(repo, 'HEAD', file)));
  return hits.some((text) => text !== undefined);
};

export { moduleInRepo };
