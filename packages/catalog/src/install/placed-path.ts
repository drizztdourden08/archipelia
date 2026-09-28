/* @layer core @kind logic */
import type { WorldLayout } from '@archipelia/model';

const placedPath = (layout: WorldLayout, module: string) =>
  (layout === 'apworld' ? `custom_worlds/${module}.apworld` : `worlds/${module}`);

export { placedPath };
