/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import { usePlatform } from '@drizztdourden08/brock-react';
import { useDataAction } from '../../../hooks/useDataAction';
import { appApi } from '../../../ipc/app-api';
import { EXPORT_NAME } from '../LibraryExport.constants';

const useLibraryExport = () => {
  const { filePicker } = usePlatform();
  const { busy, message, run } = useDataAction();

  const exportLibrary = useCallback(() => run('export', async () => {
    const result = await filePicker.saveFile({ name: EXPORT_NAME, bytes: await appApi().dataExport(), extensions: ['zip'] });
    return result.saved ? `Saved ${result.name ?? EXPORT_NAME}` : result.error ?? null;
  }), [filePicker, run]);

  return { busy, exportLibrary, message };
};

export { useLibraryExport };
