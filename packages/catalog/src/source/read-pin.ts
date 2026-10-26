/* @layer core @kind logic */
import type { SourcePin } from '@archipelia/model';
import { commitOf } from './commit-of';
import { pickPin } from './pick-pin';
import { MAX_TAGS } from './source.constants';
import type { GithubClient, RepoFacts } from './source.type';
import { tagsOf } from './tags-of';

const readPin = async (client: GithubClient, { owner, repo, branch }: RepoFacts): Promise<SourcePin> => {
  const base = `/repos/${owner}/${repo}`;
  const name = branch ?? 'HEAD';
  const [headBody, tagsBody] = await Promise.all([client.api(`${base}/commits/${encodeURIComponent(name)}`), client.api(`${base}/tags?per_page=${MAX_TAGS}`)]);
  const head = commitOf(headBody);
  if (!head) throw new Error(`${owner}/${repo} has no commits to install.`);
  const pin = pickPin(tagsOf(tagsBody), { name, sha: head.sha });
  if (pin.kind === 'head') return { ...pin, date: head.date };
  return { ...pin, date: commitOf(await client.api(`${base}/commits/${pin.sha}`))?.date };
};

export { readPin };
