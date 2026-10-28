/* @layer core @kind logic */
import type { CatalogEntry } from './game.type';

const joinsDirectly = ({ source, discovered, firstParty }: CatalogEntry): boolean => {
  if (discovered) return discovered.direct;
  return source === 'first-party' && Boolean(firstParty?.client);
};

export { joinsDirectly };
