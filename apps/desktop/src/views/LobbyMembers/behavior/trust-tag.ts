/* @layer renderer-app @kind logic */
import type { AdminLobbyMember } from '@archipelia/model';
import { TRUST_TAGS } from '../LobbyMembers.constants';
import type { TrustTag } from '../LobbyMembers.type';

const trustTag = (member: AdminLobbyMember): TrustTag => TRUST_TAGS[member.trust];

export { trustTag };
