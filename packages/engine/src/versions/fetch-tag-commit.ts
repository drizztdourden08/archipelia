/* @layer core @kind logic */
import { COMMIT_SHA, COMMIT_URL, GITHUB_SHA } from './feed-sources.constants';
import type { FetchLike } from './fetch-like.type';
import { requireOk } from './require-ok';

const fetchTagCommit = async (fetchUrl: FetchLike, tag: string): Promise<string> => {
  const res = await fetchUrl(`${COMMIT_URL}/${encodeURIComponent(tag)}`, { headers: { accept: GITHUB_SHA } });
  requireOk(res, `Archipelago ${tag} commit`);
  const commit = (await res.text()).trim();
  if (!COMMIT_SHA.test(commit)) throw new Error(`Archipelago ${tag} commit: unexpected answer`);
  return commit;
};

export { fetchTagCommit };
