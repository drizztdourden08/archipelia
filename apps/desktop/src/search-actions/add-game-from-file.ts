/* @layer renderer-app @kind logic */
import type { FilePickerPort } from '@drizztdourden08/brock-core/platform';
import { toast } from '@drizztdourden08/brock-react';
import { useLibraryStore } from '../stores/useLibraryStore';
import { APWORLD } from '../views/GameStore/GameStore.constants';
import { toastInstalled } from '../views/GameStore/behavior/toast-installed';

const addGameFromFile = async (filePicker: FilePickerPort): Promise<void> => {
  try {
    const picked = await filePicker.pickFile({ extensions: APWORLD });
    if (picked) toastInstalled(await useLibraryStore.getState().install({ kind: 'file', fileName: picked.name, bytes: picked.bytes }));
  } catch (err) {
    toast(`The game was not added: ${(err as Error).message}`, { variant: 'danger' });
  }
};

export { addGameFromFile };
