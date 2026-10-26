/* @layer renderer-app @kind logic */
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { AdminLobby } from '@archipelia/model';
import { LOOPBACK } from '../../../lobbies/lobbies.constants';
import { TLS_TEXT } from './lobby-view.constants';

const resultsFacts = (lobby: AdminLobby, onThisComputer: boolean): FactsPanelFact[] => {
  const { room } = lobby;
  if (!room) return [];
  const facts: FactsPanelFact[] = [
    { label: 'Room address', value: `${room.host}:${room.port}`, mono: true, copyable: 'room address' },
    { label: 'Room state', value: room.state === 'hosting' ? 'Hosting' : 'Stopped' },
    { label: 'Seed', value: room.seed, mono: true },
    { label: 'Connection', value: TLS_TEXT[room.tls] },
  ];
  if (onThisComputer && room.state === 'hosting') facts.splice(1, 0, { label: 'On this computer', value: `${LOOPBACK}:${room.port}`, mono: true, copyable: 'room address on this computer' });
  if (room.roomUrl) facts.push({ label: 'Room page', value: room.roomUrl, mono: true, copyable: 'room page' });
  if (room.passwordRef) facts.push({ label: 'Password', value: 'Players get it with their files.' });
  return facts;
};

export { resultsFacts };
