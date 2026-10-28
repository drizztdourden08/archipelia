/* @layer core @kind types */
import type { TreeFile } from './fetch-tree.type';

type TreeCache = { at: number; files: TreeFile[] };

export type { TreeCache };
