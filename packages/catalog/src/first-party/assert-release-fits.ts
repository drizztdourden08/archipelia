/* @layer core @kind logic */
import type { CatalogEntry } from '@archipelia/model';
import { engineFit } from './engine-fit';

const assertReleaseFits = ({ firstParty, displayName }: CatalogEntry, apVersion: string): void => {
  const unfit = firstParty && engineFit(firstParty, apVersion);
  if (unfit) throw new Error(`${displayName} is not available for this engine: ${unfit}`);
};

export { assertReleaseFits };
