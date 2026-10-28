/* @layer renderer-app @kind logic */
import type { CatalogView } from '@archipelia/catalog';

const readyNotice = (ready: CatalogView['ready']): string | undefined =>
  (ready === undefined ? undefined : `Showing the ${ready.shown} most recently updated of ${ready.total} Archipelia ready worlds.`);

export { readyNotice };
