/* @layer renderer-app @kind logic */
import { compile, matchesText } from '@drizztdourden08/tessera/data';
import type { FilterClause } from '@drizztdourden08/tessera/data';
import { SOURCE_LABEL } from '../GameStore.constants';
import { VERIFIED_LABEL } from '@archipelia/design';
import { GAME_FIELDS } from './game-schema.constants';
import { isVerified } from './is-verified';
import { rankRows } from './rank-rows';
import { recordOf } from './record-of';
import type { GameRow } from '../GameStore.type';

const textOf = (row: GameRow) => {
  const { entry } = row;
  return `${entry.displayName} ${entry.game} ${entry.apworld} ${entry.tags.join(' ')} ${SOURCE_LABEL[entry.source]} ${isVerified(row) ? VERIFIED_LABEL : ''} ${entry.discovered ? `${entry.discovered.repo} ${entry.discovered.owner}` : ''}`;
};

const filterRows = (rows: GameRow[], query: string, clauses: readonly FilterClause[]) => {
  const test = compile(clauses, GAME_FIELDS);
  return rows
    .filter((row) => matchesText(textOf(row), query) && test(recordOf(row)))
    .sort(rankRows);
};

export { filterRows };
