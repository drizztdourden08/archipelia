/* @layer renderer-app @kind logic */
import { appApi } from '../ipc/app-api';
import { NO_OWNER } from './gg-owner.constants';
import { hasGgOwner } from './has-gg-owner';

const openGgRooms = async (baseUrl: string): Promise<void> => {
  if (!(await hasGgOwner())) throw new Error(NO_OWNER);
  await appApi().ggOpenRooms(baseUrl);
};

export { openGgRooms };
