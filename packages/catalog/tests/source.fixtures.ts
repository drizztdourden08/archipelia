/* @layer tests @kind test */
import type { SourceCandidate } from '@archipelia/model';

type Route = Response | (() => Response);

const answer = (route: Route) => (typeof route === 'function' ? route() : route.clone());

const json = (body: unknown, init: ResponseInit = {}) => new Response(JSON.stringify(body), { status: 200, ...init });

const text = (body: string) => new Response(body, { status: 200 });

const missing = () => new Response('', { status: 404 });

const routedFetch = (routes: Record<string, Route>) => {
  const seen: string[] = [];
  const net = ((input: string | URL | Request) => {
    const url = String(input);
    seen.push(url);
    const route = Object.entries(routes).find(([key]) => url === key || url.startsWith(`${key}?`));
    return Promise.resolve(route ? answer(route[1]) : missing());
  }) as typeof fetch;
  return { net, seen };
};

const repoJson = (owner: string, name: string, extra: Record<string, unknown> = {}) => ({
  name,
  owner: { login: owner },
  description: `${name} by ${owner}`,
  stargazers_count: 120,
  pushed_at: '2026-10-01T00:00:00Z',
  created_at: '2024-01-01T00:00:00Z',
  archived: false,
  fork: false,
  default_branch: 'main',
  ...extra,
});

const candidate = (extra: Partial<SourceCandidate> & Pick<SourceCandidate, 'repo'>): SourceCandidate => ({
  id: `owner/${extra.repo}`,
  owner: 'owner',
  url: `https://github.com/owner/${extra.repo}`,
  stars: 10,
  archived: false,
  fork: false,
  origins: ['search'],
  contains: true,
  warnings: [],
  ...extra,
});

const API = 'https://api.github.com';

const RAW = 'https://raw.githubusercontent.com';

const NOW = Date.parse('2026-10-26T12:00:00Z');

export { API, candidate, json, NOW, RAW, repoJson, routedFetch, text };
