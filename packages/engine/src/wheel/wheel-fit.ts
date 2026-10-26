/* @layer core @kind logic */
import type { WheelFit, WheelKind } from './wheel.type';
import { parseWheelName } from './parse-wheel-name';

const kindOf = (triple: string): WheelKind => {
  const [, abi, platform] = triple.split('-');
  if (abi === 'none' && platform === 'any') return 'pure';
  return abi === 'abi3' ? 'abi3' : 'exact';
};

const wheelFit = (file: string, tags: readonly string[]): WheelFit | undefined => {
  const name = parseWheelName(file);
  if (!name) return undefined;
  const ranks = name.triples.map((triple) => ({ triple, rank: tags.indexOf(triple) })).filter((found) => found.rank !== -1);
  const [best] = ranks.sort((left, right) => left.rank - right.rank);
  return best ? { rank: best.rank, kind: kindOf(best.triple) } : undefined;
};

export { wheelFit };
