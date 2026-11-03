/* @layer renderer-app @kind logic */
import type { LobbySeatAction } from '@archipelia/design';
import type { AdminLobby, AdminLobbyMember } from '@archipelia/model';
import { MEMBER_TEXT } from '../LobbyMembers.constants';
import type { LobbyMembersModel } from '../LobbyMembers.type';
import { memberActions } from './member-actions';

const memberSeatTools = (lobby: AdminLobby, member: AdminLobbyMember, model: LobbyMembersModel): LobbySeatAction[] => {
  const disabled = model.isBusy();
  const nameSuffix = member.displayName;
  const view: LobbySeatAction[] = member.slots.length === 0 ? [] : [{ id: 'options', label: MEMBER_TEXT.options, nameSuffix, icon: 'eye', onSelect: () => model.viewOptions(member) }];
  const remove: LobbySeatAction[] = memberActions(lobby, member).remove ? [{ id: 'remove', label: MEMBER_TEXT.remove, nameSuffix, icon: 'trash-2', disabled, onSelect: () => model.remove(member) }] : [];
  return [...view, ...remove];
};

export { memberSeatTools };
