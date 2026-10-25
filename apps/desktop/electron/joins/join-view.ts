/* @layer electron-main @kind logic */
import type { JoinView } from '../../src/joins/joins.type';
import type { JoinRecord } from './joins.type';

const joinView = (record: JoinRecord): JoinView => ({
  id: record.id, address: record.address, code: record.code, displayName: record.displayName, slotName: record.slotName, game: record.game,
  state: record.state, lobbyName: record.lobbyName, ap: record.ap, slotState: record.slotState, message: record.message, results: record.results,
  createdAt: record.createdAt, updatedAt: record.updatedAt,
});

export { joinView };
