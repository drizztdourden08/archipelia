/* @layer core @kind logic */
import type { CatalogEntry, InstalledGame } from '@archipelia/model';

const assertRepoAccepted = ({ displayName, discovered }: CatalogEntry, accepted: number | undefined, before: InstalledGame | null): void => {
  if (!discovered || accepted === discovered.repoId || before?.origin?.repoId === discovered.repoId) return;
  throw new Error(`${displayName} comes from ${discovered.repo}, which Archipelia has not reviewed. Accept it before it is added.`);
};

export { assertRepoAccepted };
