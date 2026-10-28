/* @layer core @kind types */
import type { CatalogEntry } from '@archipelia/model';
import type { ReadyRepo } from './ready.type';

type Candidate = { repo: ReadyRepo; entry: CatalogEntry };

type Resolved = { entries: CatalogEntry[]; problems: string[] };

export type { Candidate, Resolved };
