/* @layer core @kind logic */
import type { LobbyState, StateMember } from '@archipelia/lobby-protocol';
import type { Lobby, LobbyMember } from '@archipelia/model';
import { SERVER_NAME } from '../lobby.constants';
import { liveMembers } from './live-members';

const slotView = ({ name, game, state, reason }: LobbyMember['slots'][number]) => (reason === undefined ? { name, game, state } : { name, game, state, reason });

const memberView = (member: LobbyMember, serverVersion: string): StateMember => ({
  id: member.id,
  displayName: member.displayName,
  client: member.client ? { name: member.client.name, version: member.client.version } : { name: SERVER_NAME, version: serverVersion },
  trust: member.trust,
  admission: member.admission,
  ready: member.ready,
  slots: member.slots.map(slotView),
});

const lobbyView = (lobby: Lobby, viewer: LobbyMember, serverVersion: string): LobbyState => {
  const base = { type: 'lobby.state' as const, rev: lobby.rev, phase: lobby.phase, engine: { ap: lobby.engine.ap } };
  if (viewer.admission !== 'pending') {
    return { ...base, members: liveMembers(lobby).map((member) => memberView(member, serverVersion)) };
  }
  const others = liveMembers(lobby).filter((member) => member.id !== viewer.id);
  const approved = others.filter((member) => member.admission === 'approved').length;
  return { ...base, members: [memberView(viewer, serverVersion)], others: { approved, pending: others.length - approved } };
};

export { lobbyView };
