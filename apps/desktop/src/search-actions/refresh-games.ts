/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { useLibraryStore } from '../stores/useLibraryStore';

const refreshGames = async (): Promise<void> => {
  try {
    await useLibraryStore.getState().loadGames(true);
    toast('The games index is up to date', { variant: 'success' });
  } catch (err) {
    toast(`The games index did not refresh: ${(err as Error).message}`, { variant: 'danger' });
  }
};

export { refreshGames };
