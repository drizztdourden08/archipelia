/* @layer core @kind types */

type Listing = {
  module: string;
  game: string;
  displayName: string;
  home: string;
  tags: string[];
  repo: string;
  client?: string;
  world: string;
  bundle: string;
};

export type { Listing };
