/* @layer core @kind logic */
import { isRecord } from '@archipelia/model';
import { NATIVE_BUILD_FILES, NATIVE_FILE, SUBMODULES_FILE } from './source.constants';
import type { TreeFacts } from './source.type';

const baseName = (path: string) => path.slice(path.lastIndexOf('/') + 1);

const pathsOf = (tree: unknown): string[] =>
  (Array.isArray(tree) ? tree : []).flatMap((item: unknown) => (isRecord(item) && typeof item.path === 'string' ? [item.path] : []));

const treeFactsOf = (body: unknown): TreeFacts => {
  if (!isRecord(body)) return { native: false, submodules: false, unsure: true };
  const paths = pathsOf(body.tree);
  return {
    native: paths.some((path) => NATIVE_FILE.test(path) || NATIVE_BUILD_FILES.has(baseName(path).toLowerCase())),
    submodules: paths.includes(SUBMODULES_FILE),
    unsure: body.truncated === true || paths.length === 0,
  };
};

export { treeFactsOf };
