/* @layer core @kind logic */
import type { Lobby, UploadTrust } from '@archipelia/model';
import type { Outcome } from '../lobby-service.type';
import type { Assessed } from './join-lobby.type';

const checkTrust = (lobby: Lobby, { clientName, trust }: Assessed): Outcome<UploadTrust> => {
  if (!trust.ok || trust.value.level !== 'unlisted' || lobby.options.allowUnlisted) return trust;
  return { ok: false, failure: { code: 'unlisted-not-allowed', message: `This lobby takes listed clients only. ${clientName} is not listed.` } };
};

export { checkTrust };
