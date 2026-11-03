/* @layer core @kind types */
type SpoilerSetting = { key: string; value: string };

type SpoilerPlayer = { slot: number; name: string; game: string; options: readonly SpoilerSetting[] };

type SpoilerPlacement = {
  id: number;
  location: string;
  finder: string;
  item: string;
  receiver: string;
  sphere: number | null;
  required: boolean;
};

type SpoilerSphere = { index: number; placements: readonly SpoilerPlacement[] };

type EntranceDirection = '=>' | '<=' | '<=>';

type SpoilerEntrance = { player: string | null; entrance: string; exit: string; direction: EntranceDirection };

type SpoilerPath = { title: string; steps: readonly string[] };

type SpoilerSection = { title: string; lines: readonly string[] };

type SpoilerKnown = { players?: readonly string[]; locations?: Iterable<string> };

type SpoilerLog = {
  version: string;
  seed: string;
  settings: readonly SpoilerSetting[];
  players: readonly SpoilerPlayer[];
  placements: readonly SpoilerPlacement[];
  spheres: readonly SpoilerSphere[];
  entrances: readonly SpoilerEntrance[];
  paths: readonly SpoilerPath[];
  unreachable: readonly string[];
  sections: readonly SpoilerSection[];
  unparsed: readonly string[];
};

type ItemClass = 'progression' | 'useful' | 'trap' | 'filler';

type SpoilerItemType = ItemClass | 'required' | 'unknown';

type SpoilerItemTypes = {
  players: readonly string[];
  locations: ReadonlySet<string>;
  classes: ReadonlyMap<string, ItemClass>;
};

type SplitLine = { location: string; finder: string; item: string; receiver: string };

type LineContext = { names: readonly string[]; locations: ReadonlySet<string>; items: ReadonlySet<string> };

type SplitSpoiler = { head: readonly string[]; sections: readonly SpoilerSection[] };

type SpoilerHead = Pick<SpoilerLog, 'version' | 'seed' | 'settings' | 'players'>;

type OpenPlayer = { slot: number; name: string; options: SpoilerSetting[] };

type HeadState = { settings: SpoilerSetting[]; open: OpenPlayer[]; inPlayer: boolean };

type SidecarRow = { finder: string; location: string; flags: number };

type Block = { index: number; lines: string[] };

export type {
  Block, EntranceDirection, HeadState, ItemClass, LineContext, OpenPlayer, SidecarRow, SpoilerEntrance, SpoilerHead, SpoilerItemType, SpoilerItemTypes, SpoilerKnown, SpoilerLog,
  SpoilerPath, SpoilerPlacement, SpoilerPlayer, SpoilerSection, SpoilerSetting, SpoilerSphere, SplitLine, SplitSpoiler,
};
