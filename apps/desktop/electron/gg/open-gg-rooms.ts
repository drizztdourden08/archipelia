/* @layer electron-main @kind logic */
import { openExternal } from '@drizztdourden08/brock-electron/main';
import type { SecretReader } from '@archipelia/hosts';
import { GG_OWNER_SECRET } from '@archipelia/hosts';

const openGgRooms = async (baseUrl: string, secrets: SecretReader): Promise<void> => {
  if (!baseUrl.startsWith('https://')) throw new Error('the site address must start with https://');
  const ownerId = await secrets.get(GG_OWNER_SECRET);
  if (!ownerId) throw new Error('no archipelago.gg owner id is stored yet');
  if (!(await openExternal(`${baseUrl.replace(/\/+$/, '')}/session/${ownerId}`))) throw new Error('the rooms page did not open in the browser');
};

export { openGgRooms };
