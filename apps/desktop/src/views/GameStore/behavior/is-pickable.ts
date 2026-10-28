/* @layer renderer-app @kind logic */
import type { CatalogEntry } from '@archipelia/model';

const isPickable = ({ source }: CatalogEntry): boolean => source === 'index' || source === 'first-party';

export { isPickable };
