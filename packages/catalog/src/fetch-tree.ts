/* @layer core @kind logic */
import { treeUrl } from './tree-url';
import type { IndexSource } from './index-source.type';
import type { TreeFile, TreeResponse } from './fetch-tree.type';
import { INDEX_FILE, ROOT_FILES } from './fetch-tree.constants';

const fetchIndexTree = async (source: IndexSource) => {
  const res = await fetch(treeUrl(source), { headers: { accept: 'application/vnd.github+json' } });
  if (!res.ok) throw new Error(`index tree: HTTP ${res.status}`);
  const body = (await res.json()) as TreeResponse;
  if (body.truncated) throw new Error('index tree: GitHub truncated the listing');
  return body.tree
    .filter((e) => e.type === 'blob' && (INDEX_FILE.test(e.path) || ROOT_FILES.has(e.path)))
    .map((e): TreeFile => ({ path: e.path, sha: e.sha }));
};

export { fetchIndexTree };
