/* @layer core @kind logic */
import type { GithubRepo } from '../enrich/enrich.type';
import type { GithubClient, SetupFiles } from './source.type';

const readSetupFiles = async (client: GithubClient, repo: GithubRepo, rev: string): Promise<SetupFiles> => {
  const [pyproject, setupCfg, setupPy] = await Promise.all([
    client.raw(repo, rev, 'pyproject.toml'), client.raw(repo, rev, 'setup.cfg'), client.raw(repo, rev, 'setup.py'),
  ]);
  return { pyproject, setupCfg, setupPy };
};

export { readSetupFiles };
