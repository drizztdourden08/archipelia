/* @layer core @kind types */
import type { WorldLayout } from '@archipelia/model';

type OfficialWorld = {
  apworld: string;
  game: string;
  file: string;
  sha256: string;
  layout: WorldLayout;
  worldVersion?: string;
  requires: string[];
  optional: string[];
};

export type { OfficialWorld };
