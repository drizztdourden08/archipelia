/* @layer renderer-app @kind logic */
import { joinsDirectly } from '@archipelia/model';
import { DIRECT_CHOICE, FIT_LABEL, NO_RELEASE, SOURCE_LABEL, STATE_LABEL, VERIFIED_CHOICE } from '../GameStore.constants';
import { isVerified } from './is-verified';
import type { GameRecord, GameRow } from '../GameStore.type';

const fitOf = ({ entry }: GameRow) => {
  if (!entry.unavailable) return FIT_LABEL.fits;
  return entry.unavailable === NO_RELEASE ? FIT_LABEL.none : FIT_LABEL.blocked;
};

const recordOf = (row: GameRow): GameRecord => ({
  name: row.entry.displayName,
  source: SOURCE_LABEL[row.entry.source],
  state: STATE_LABEL[row.state],
  fit: fitOf(row),
  verified: isVerified(row) ? VERIFIED_CHOICE.yes : VERIFIED_CHOICE.no,
  direct: joinsDirectly(row.entry) ? DIRECT_CHOICE.yes : DIRECT_CHOICE.no,
  stability: row.entry.stability,
  tags: row.entry.tags,
});

export { recordOf };
