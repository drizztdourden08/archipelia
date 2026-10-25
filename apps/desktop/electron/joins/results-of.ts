/* @layer electron-main @kind logic */
import type { LobbyStarted } from '@drizztdourden08/archipelia-lobby-protocol';
import { joinAddress } from '../../src/lobbies/join-address';
import { LOOPBACK_HOST } from '../../src/lobbies/lobbies.constants';
import type { JoinResults } from '../../src/joins/joins.type';
import type { JoinRecord } from './joins.type';

const sameComputer = (address: string): boolean => {
  const parsed = joinAddress(address);
  return 'target' in parsed && LOOPBACK_HOST.test(parsed.target.host);
};

const resultsOf = (record: JoinRecord, started: LobbyStarted): JoinResults => {
  const { room } = started;
  const mine = started.slots.find((slot) => slot.name === record.slotName);
  return {
    seed: started.seed, address: room.address, sameComputer: sameComputer(record.address), slot: record.slotName, game: mine?.game ?? record.game,
    files: (mine?.files ?? []).map((file) => ({ name: file.name, size: file.size })),
    ...(room.localAddress ? { localAddress: room.localAddress } : {}),
    ...(room.password ? { password: room.password } : {}),
    ...(room.roomUrl ? { roomUrl: room.roomUrl } : {}),
  };
};

export { resultsOf };
