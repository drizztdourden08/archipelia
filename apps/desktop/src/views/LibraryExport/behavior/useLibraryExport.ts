/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import { toast, usePlatform } from '@drizztdourden08/brock-react';
import { useDataAction } from '../../../hooks/useDataAction';
import { appApi } from '../../../ipc/app-api';
import { EXPORT_NAME } from '../LibraryExport.constants';

const useLibraryExport = () => {
  const { filePicker } = usePlatform();
  const { busy, message, run } = useDataAction();

  const exportLibrary = useCallback(() => run('export', async () => {
    const result = await filePicker.saveFile({ name: EXPORT_NAME, bytes: await appApi().dataExport(), extensions: ['zip'] });
    if (!result.saved) return result.error ?? null;
    const saved = `Saved ${result.name ?? EXPORT_NAME}`;
    toast(saved, { variant: 'success' });
    return saved;
  }), [filePicker, run]);

  return { busy, exportLibrary, message };
};

export { useLibraryExport };
