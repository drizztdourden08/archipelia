/* @layer electron-main @kind logic */
import { shell } from 'electron';
import type { SecretReader } from '@archipelia/hosts';
import { GG_OWNER_SECRET } from '../../src/secrets/secret-names.constants';

const openGgRooms = async (baseUrl: string, secrets: SecretReader): Promise<void> => {
  if (!baseUrl.startsWith('https://')) throw new Error('the site address must start with https://');
  const ownerId = await secrets.get(GG_OWNER_SECRET);
  if (!ownerId) throw new Error('no archipelago.gg owner id is stored yet');
  await shell.openExternal(`${baseUrl.replace(/\/+$/, '')}/session/${ownerId}`);
};

export { openGgRooms };
