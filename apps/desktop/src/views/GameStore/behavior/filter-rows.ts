/* @layer renderer-app @kind logic */
import { compile, matchesText } from '@drizztdourden08/tessera/data';
import type { FilterClause } from '@drizztdourden08/tessera/data';
import { GAME_FIELDS } from './game-schema.constants';
import { recordOf } from './record-of';
import type { GameRow } from '../GameStore.type';

const textOf = ({ entry }: GameRow) => `${entry.displayName} ${entry.game} ${entry.apworld} ${entry.tags.join(' ')}`;

const filterRows = (rows: GameRow[], query: string, clauses: readonly FilterClause[]) => {
  const test = compile(clauses, GAME_FIELDS);
  return rows
    .filter((row) => matchesText(textOf(row), query) && test(recordOf(row)))
    .sort((a, b) => a.entry.displayName.localeCompare(b.entry.displayName));
};

export { filterRows };
