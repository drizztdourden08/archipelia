/* @layer renderer-app @kind logic */
import type { LobbyServerEntry } from '@archipelia/model';
import { normalizePin } from '../../../lobbies/normalize-pin';
import type { ServerDraft } from '../ArchipeliaServers.type';

const newEntry = ({ label, url, pin }: ServerDraft): LobbyServerEntry => ({
  id: '', label: label.trim(), url: url.trim(), tokenRef: '', ...(pin.trim() ? { certSha256: normalizePin(pin) } : {}),
});

export { newEntry };
