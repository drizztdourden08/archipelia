/* @layer core @kind types */
import type { CatalogEntry, InstalledGame, InstalledRelease } from '@archipelia/model';
import type { Registry } from '@archipelia/trust';

type ReinstallChoiceParams = { entry: CatalogEntry; registry: Registry; ap: string; before: InstalledGame | null };

type ReinstallChoice = { entry: CatalogEntry; version: string; release?: InstalledRelease; note?: string };

export type { ReinstallChoice, ReinstallChoiceParams };
