/* @layer tests @kind test */
import { createHash } from 'node:crypto';
import { SEARCH_QUERY } from '../src/ready/ready.constants';
import { json, missing } from './first-party.fixtures';

const SEARCH_URL = `https://api.github.com/search/repositories?q=${encodeURIComponent(SEARCH_QUERY)}&sort=updated&order=desc&per_page=100&page=1`;

const manifestUrl = (repo: string) => `https://github.com/${repo}/releases/latest/download/archipelia.json`;

type Topic = { id: number; repo: string; stars?: number; createdAt?: string; topics?: string[] };

const itemOf = ({ id, repo, stars = 0, createdAt = '2026-01-01T00:00:00Z', topics = ['archipelia-world'] }: Topic) => ({
  id, full_name: repo, owner: { login: repo.split('/')[0] }, topics, fork: false, archived: false, disabled: false,
  stargazers_count: stars, pushed_at: '2026-10-01T00:00:00Z', created_at: createdAt,
});

const searchOf = (topics: Topic[], total = topics.length) => () => json({ total_count: total, items: topics.map(itemOf) });

const readyManifest = (game: string, module: string, patch: Record<string, unknown> = {}) => ({
  format: 1,
  game,
  module,
  worldVersion: '1.0.0',
  minimumAp: '0.6.4',
  world: { file: `${module}.apworld`, sha256: createHash('sha256').update(module).digest('hex'), size: 100 },
  ...patch,
});

const manifestRoute = (repo: string, manifest: unknown) => ({ [manifestUrl(repo)]: () => json(manifest) });

const noManifest = (repo: string) => ({ [manifestUrl(repo)]: missing });

export { SEARCH_URL, manifestRoute, manifestUrl, noManifest, readyManifest, searchOf };
