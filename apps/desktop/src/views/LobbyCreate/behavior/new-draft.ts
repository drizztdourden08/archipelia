/* @layer renderer-app @kind logic */
import type { LobbyDraft } from '../../../lobbies/lobbies.type';
import { DEFAULT_MAX_SLOTS } from '../LobbyCreate.constants';
import type { RoomDefaults } from '../LobbyCreate.type';

const newDraft = ({ port }: RoomDefaults): LobbyDraft => ({
  name: '', admission: 'host-approval', allowUnlisted: false, maxSlots: DEFAULT_MAX_SLOTS, room: { kind: 'local', port },
});

export { newDraft };
