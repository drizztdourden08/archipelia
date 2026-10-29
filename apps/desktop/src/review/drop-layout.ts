/* @layer renderer-app @kind logic */
import type { SessionTemplate } from '@archipelia/model';
import { appApi } from '../ipc/app-api';
import { useLibraryStore } from '../stores/useLibraryStore';

const dropLayout = async (made: readonly SessionTemplate[]): Promise<void> => {
  for (const template of made) await appApi().templatesRemove(template.id);
  await useLibraryStore.getState().loadTemplates();
};

export { dropLayout };
