/* @layer renderer-app @kind logic */
import { formatBytes } from '@drizztdourden08/brock-core/format';
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { JoinResults } from '../../../joins/joins.type';

const resultFacts = (results: JoinResults): FactsPanelFact[] => [
  { label: 'Room address', value: results.address, mono: true, copyable: 'room address' },
  ...(results.sameComputer && results.localAddress ? [{ label: 'On this computer', value: results.localAddress, mono: true, copyable: 'room address on this computer' }] : []),
  ...(results.password ? [{ label: 'Password', value: results.password, mono: true, copyable: 'room password' }] : []),
  { label: 'Slot', value: results.slot },
  { label: 'Game', value: results.game },
  { label: 'Seed', value: results.seed, mono: true },
  ...(results.roomUrl ? [{ label: 'Room page', value: results.roomUrl, mono: true, copyable: 'room page' }] : []),
  ...results.files.map((file) => ({ label: file.name, value: file.saved ?? formatBytes(file.size), mono: true, copyable: file.saved ? 'file path' : false })),
];

export { resultFacts };
