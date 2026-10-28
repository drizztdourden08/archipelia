/* @layer core @kind types */
import type { TreeFile } from './fetch-tree.type';
import type { Catalog } from './read-catalog.type';

type Listing = { files: TreeFile[]; limited?: Catalog['limited'] };

export type { Listing };
