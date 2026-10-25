/* @layer core @kind logic */
import { treeUrl } from './tree-url';
import type { IndexSource } from './index-source.type';
import type { TreeFile, TreeNode, TreeResponse } from './fetch-tree.type';
import { INDEX_DIR, INDEX_FILE, ROOT_FILES } from './fetch-tree.constants';

const getTree = async (url: string) => {
  const res = await fetch(url, { headers: { accept: 'application/vnd.github+json' } });
  if (!res.ok) throw new Error(`index tree: HTTP ${res.status}`);
  return (await res.json()) as TreeResponse;
};

const isIndexFile = (e: TreeNode) => e.type === 'blob' && (INDEX_FILE.test(e.path) || ROOT_FILES.has(e.path));

const walkFoldersOfTruncatedTree = async (source: IndexSource) => {
  const root = await getTree(treeUrl(source, source.ref, false));
  if (root.truncated) throw new Error('index tree: GitHub truncated the root listing');
  const dir = root.tree.find((e) => e.type === 'tree' && e.path === INDEX_DIR);
  if (!dir) throw new Error('index tree: the index folder is missing');
  const inner = await getTree(treeUrl(source, dir.sha, false));
  if (inner.truncated) throw new Error('index tree: GitHub truncated the index folder');
  return [...root.tree, ...inner.tree.map((e) => ({ ...e, path: `${INDEX_DIR}/${e.path}` }))];
};

const fetchIndexTree = async (source: IndexSource) => {
  const body = await getTree(treeUrl(source));
  const nodes = body.truncated ? await walkFoldersOfTruncatedTree(source) : body.tree;
  return nodes.filter(isIndexFile).map((e): TreeFile => ({ path: e.path, sha: e.sha }));
};

export { fetchIndexTree };
