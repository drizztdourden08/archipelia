/* @layer core @kind logic */
import { parseEntrances } from './parse-entrances';
import { parseHead } from './parse-head';
import { parsePaths } from './parse-paths';
import { parsePlacements } from './parse-placements';
import { parsePlaythrough } from './parse-playthrough';
import { SECTION_TITLE } from './spoiler.constants';
import { splitSpoiler } from './split-spoiler';
import type { SpoilerKnown, SpoilerLog, SpoilerSection } from './spoiler.type';

const bodyOf = (sections: readonly SpoilerSection[], title: string) =>
  sections.find((section) => section.title.toLowerCase() === title)?.lines ?? [];

const isReserved = ({ title }: SpoilerSection) => Object.values<string>(SECTION_TITLE).includes(title.toLowerCase());

const parseSpoiler = (text: string, known: SpoilerKnown = {}): SpoilerLog => {
  const { head, sections } = splitSpoiler(text.split(/\r?\n/));
  const { version, seed, settings, players } = parseHead(head, known);
  const names = players.length > 0 ? players.map((player) => player.name) : [...(known.players ?? [])];
  const { placements, unparsed } = parsePlacements(bodyOf(sections, SECTION_TITLE.locations), {
    names,
    locations: new Set(known.locations ?? []),
  });
  const spheres = parsePlaythrough(bodyOf(sections, SECTION_TITLE.playthrough), placements, names);
  return {
    version,
    seed,
    settings,
    players,
    placements,
    spheres,
    entrances: parseEntrances(bodyOf(sections, SECTION_TITLE.entrances), names),
    paths: parsePaths(bodyOf(sections, SECTION_TITLE.paths)),
    unreachable: bodyOf(sections, SECTION_TITLE.unreachable).filter((line) => line.trim() !== ''),
    sections: sections.filter((section) => !isReserved(section)),
    unparsed,
  };
};

export { parseSpoiler };
