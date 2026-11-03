/* @layer core @kind logic */
import { indexesOf } from './indexes-of';
import { SEPARATOR } from './spoiler.constants';
import type { SplitLine } from './spoiler.type';

const soloCandidates = (line: string, name: string): SplitLine[] =>
  indexesOf(line, SEPARATOR).map((at) => ({
    location: line.slice(0, at),
    finder: name,
    item: line.slice(at + SEPARATOR.length),
    receiver: name,
  }));

const finderCandidates = (rest: string, receiver: string, names: readonly string[]): SplitLine[] =>
  names.flatMap((finder) => {
    const marker = ` (${finder}): `;
    return indexesOf(rest, marker).map((at) => ({
      location: rest.slice(0, at),
      finder,
      item: rest.slice(at + marker.length),
      receiver,
    }));
  });

const sharedCandidates = (line: string, names: readonly string[]): SplitLine[] =>
  names
    .filter((receiver) => line.endsWith(` (${receiver})`))
    .flatMap((receiver) => finderCandidates(line.slice(0, line.length - receiver.length - 3), receiver, names));

const lineCandidates = (line: string, names: readonly string[]): SplitLine[] => {
  const found = names.length > 1 ? sharedCandidates(line, names) : soloCandidates(line, names[0] ?? '');
  return found.sort((a, b) => a.location.length - b.location.length);
};

export { lineCandidates };
