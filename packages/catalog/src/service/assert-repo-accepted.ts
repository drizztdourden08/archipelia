/* @layer core @kind logic */
import type { CatalogEntry, InstalledGame, WorldOrigin } from '@archipelia/model';
import { sameName } from '../ready/same-name';

const ownerOf = (repo: string): string => repo.split('/')[0] ?? '';

const sameRepo = (origin: WorldOrigin | undefined, { repoId, repo }: { repoId: number; repo: string }): boolean =>
  origin?.repoId === repoId && sameName(ownerOf(origin.repo), ownerOf(repo));

const assertRepoAccepted = ({ displayName, discovered }: CatalogEntry, accepted: number | undefined, before: InstalledGame | null): void => {
  if (!discovered || accepted === discovered.repoId || sameRepo(before?.origin, discovered)) return;
  throw new Error(`${displayName} comes from ${discovered.repo}, which Archipelia has not reviewed. Accept it before it is added.`);
};

export { assertRepoAccepted };
